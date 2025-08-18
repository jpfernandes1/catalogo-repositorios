import React, {useState, useEffect} from 'react';
import { Container, Owner, Loading, Titulo, Paragrafo, BackButton } from './style';
import api from "../../services/api";
import {FaArrowLeft} from 'react-icons/fa';
import { useParams } from "react-router-dom";


export default function Repositorio() {

  const [repositorioData, setRepositorioData] = useState({}); // Para guardar os dados vindos da API
  const [issues, setIssues] = useState([]);
  const[loading, setLoading] = useState(true);

  const { repositorio } = useParams(); // Parametros da URL

  useEffect(() => {
    async function load(){
      const nomeRepo = decodeURIComponent(repositorio);;

      const [repoResponse, issuesResponse] = await Promise.all([
        api.get(`/repos/${nomeRepo}`),
        api.get(`/repos/${nomeRepo}/issues`, {
          params: {
            state: 'open',
            per_page: 5
          }
        })
      ]);

      setRepositorioData(repoResponse.data);
      setIssues(issuesResponse.data);
      setLoading(false);

    }
    if (repositorio) {
      load();
    }
  }, [repositorio]);

  if(loading){
    return(
    <Loading>
      <Titulo>Carregando...</Titulo>
    </Loading>

  )}

return (
  <Container>
    <BackButton to="/">
      <FaArrowLeft color="#000" size={30}/>
    </BackButton>
    {repositorioData?.owner && (
        <Owner>
        <img
          src={repositorioData.owner.avatar_url}
          alt={repositorioData.owner.login}
        />
        <Titulo>{repositorioData.name}</Titulo>
        <Paragrafo>{repositorioData.description}</Paragrafo>
      </Owner>
    )}
  </Container>
);
}
