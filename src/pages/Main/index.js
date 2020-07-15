import React, { Component } from 'react';
import { FaGithubAlt, FaPlus, FaSpinner, FaInfoCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../services/api';

import Container from '../../conponents/Container';
import { Form, SubmitButton, List } from './styles';

class Main extends Component {
  // eslint-disable-next-line react/state-in-constructor
  state = {
    newRepo: '',
    repositories: [],
    loading: 0,
    existRepo: 1,
    error: '',
  };

  componentDidMount() {
    const repositories = localStorage.getItem('repositories');

    if (repositories) {
      this.setState({ repositories: JSON.parse(repositories) });
    }
  }

  componentDidUpdate(_, prevState) {
    const { repositories } = this.state;

    if (prevState.repositories !== repositories) {
      localStorage.setItem('repositories', JSON.stringify(repositories));
    }
  }

  handleInputChange = (e) => {
    this.setState({ newRepo: e.target.value });
    this.setState({ error: '' });
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    this.setState({ loading: 1, existRepo: 1 });

    try {
      const { newRepo, repositories } = this.state;

      if (newRepo === '') {
        throw this.setState({
          error: 'Você precisa indicar um repositório válido',
        });
      }

      const hasRepo = repositories.find((r) => r.name === newRepo);

      if (hasRepo) {
        throw this.setState({ error: 'Repositório duplicado' });
      }

      const response = await api.get(`/repos/${newRepo}`);

      const data = {
        name: response.data.full_name,
      };

      this.setState({
        repositories: [...repositories, data],
        newRepo: '',
        loading: 0,
        error: '',
      });
    } catch (err) {
      this.setState({ existRepo: 0 });
      this.setState({ loading: 0 });
    }
  };

  render() {
    const { newRepo, repositories, loading, existRepo, error } = this.state;

    toast.configure();

    return (
      <Container>
        <h1>
          <FaGithubAlt />
          Repositórios
        </h1>

        <Form onSubmit={this.handleSubmit} existRepo={existRepo}>
          <input
            type="text"
            placeholder="Adicionar repositório"
            value={newRepo}
            onChange={this.handleInputChange}
          />

          <SubmitButton loading={loading} error={error}>
            {loading ? (
              <FaSpinner color="#FFF" size={14} />
            ) : (
              <FaPlus color="#fff" size={14} />
            )}
          </SubmitButton>
        </Form>

        <List>
          {repositories.map((repository) => (
            <li key={repository.name}>
              <span>{repository.name}</span>
              <Link to={`/repository/${encodeURIComponent(repository.name)}`}>
                <FaInfoCircle />
              </Link>
            </li>
          ))}
        </List>
      </Container>
    );
  }
}

export default Main;
