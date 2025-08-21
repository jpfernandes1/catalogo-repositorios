import React, {useState, useEffect} from 'react';
import { Container, Owner, Loading, Titulo, Paragrafo, BackButton, IssuesList,PageActions, FilterList } from './style';
import api from "../../services/api";
import {FaArrowLeft} from 'react-icons/fa';
import { useParams } from "react-router-dom";


export default function Repositorio() {

  const [repositorioData, setRepositorioData] = useState({}); // Para guardar os dados vindos da API
  const [issues, setIssues] = useState([]);
  const[loading, setLoading] = useState(true);

  const { repositorio } = useParams(); // Parametros da URL
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState([
    {state: 'all', label: 'Todas', active:true},
    {state: 'open', label: 'Abertas', active:false},
    {state: 'closed', label: 'Fechadas', active:false},
  ])
  const [filterIndex, setFilterIndex] = useState(0);

  useEffect(() => {
    async function load(){
      const nomeRepo = decodeURIComponent(repositorio);;

      const [repoResponse, issuesResponse] = await Promise.all([
        api.get(`/repos/${nomeRepo}`),
        api.get(`/repos/${nomeRepo}/issues`, {
          params: {
            state: filters.find(f => f.active).state,
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

  useEffect(() => {
    async function loadIssue(){
    const nomeRepo = decodeURIComponent(repositorio);
    const response = await api.get(`/repos/${nomeRepo}/issues`, {
      params:{
        state: filters[filterIndex].state,
        page,
        per_page: 5,
      },
    });
   
    setIssues(response.data);
    
  }
     if (repositorio) {
      loadIssue();
    }
  }, [filters, filterIndex, page, repositorio]);

  function handlePage(action){
    setPage(action === 'back' ? page - 1 : page + 1)
  }

  function handleFilter(index){
    setFilterIndex(index);
  }

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

    <FilterList active={filterIndex}>
      {filters.map((filter, index) => (
        <button
          type="button" 
          key={filter.label}
          onClick={() => handleFilter(index)}
          >
            {filter.label}
          </button>
      ))}
    </FilterList>

    <IssuesList>
      {issues.map(issue => (
        <li key={String(issue.id)}>
          <img src={issue.user.avatar_url} alt={issue.user.login} />
          <div>
            <strong>
              <a href={issue.html_url} target="_blank">{issue.title}</a>
              {issue.labels.map(label => (
                <span key={String(label.id)}>{label.name}</span>
              ))}

            </strong>
            <p>{issue.user.login}</p>
          </div>
        </li>
      ))}
    </IssuesList>

    <PageActions>
      <button 
      type="button" 
      onClick={()=> handlePage('back')}
      disabled={page < 2}>
        Voltar
      </button>
      <button type="button" onClick={() =>handlePage('next')}>
        Proxima
      </button>
    </PageActions>
  </Container>
);
}
