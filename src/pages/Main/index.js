import React, {useState, useCallback, useEffect} from 'react'
import {FaGithub, FaPlus, FaSpinner, FaBars, FaTrash} from 'react-icons/fa'
import {Container, Form, SubmitButton, List, DeleteButton} from './styles'
import api from '../../services/api';
import { Link } from 'react-router-dom';


export default function Main(){

    const [newRepo, setNewRepo] = useState('');
    const [repositorios, setRepositorios] = useState(() => {
    const repoStorage = localStorage.getItem('repos');
    return repoStorage ? JSON.parse(repoStorage) : [];
});
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() =>{
        localStorage.setItem('repos', JSON.stringify(repositorios));
    }, [repositorios])

    const handleSubmit = useCallback((e) => {
        e.preventDefault();

        async function submit(){
            setLoading(true);
            setError('')
            try{
                const hasRepo = repositorios.find(repo => repo.name === newRepo);
                if(hasRepo){
                    setError('Repositório já adicionado!')
                    return
                }

                const response = await api.get(`repos/${newRepo}`);

                const data = {
                    name: response.data.full_name,
                }
            
            setRepositorios([...repositorios, data])
            setNewRepo('');
            } catch(error){
                if (error.response && error.response.status === 404) {
                    setError('Repositório não encontrado.');
                } else {
                    setError('Erro ao buscar repositório. Tente novamente.');
                }
            } finally{
                setLoading(false);
        }
    }

        submit();

    }, [newRepo, repositorios]);

    const handleDelete = useCallback((repo) => {
        const find = repositorios.filter(r => r.name !== repo);
        setRepositorios(find);
    }, [repositorios]);

    function handleInputChange(e){
        setNewRepo(e.target.value);
    }
    
    return(
       <Container>

            <h1>
                <FaGithub size={25}/>
                Meus Repositórios
            </h1>

            <Form onSubmit={handleSubmit}>
                <input 
                type="text" 
                placeholder='Adicionar Repositórios'
                value={newRepo}
                onChange={handleInputChange}/>

                <SubmitButton $loading={loading ? 1: 0}>
                    {loading ? (
                        <FaSpinner color="#FFF" size={14}/>
                    ) : (<FaPlus color= "#FFF" size={14}/>
                    )}
                </SubmitButton>
                
            </Form>

             {/* Mostra erro se existir */}
            {error && <p style={{color: 'red', marginTop: '5px'}}>{error}</p>}

            <List>
                {repositorios.map(repo => (
                    <li key={repo.name}>
                        <span>
                            <DeleteButton onClick={()=> handleDelete(repo.name)}>
                                <FaTrash size={14}/>
                            </DeleteButton>
                            {repo.name}
                        </span>
                        <Link to={`/repositorio/${encodeURIComponent(repo.name)}`}>
                            <FaBars size={20}/>
                        </Link>
                    </li>
                ))}
            </List>

       </Container>
    )
}