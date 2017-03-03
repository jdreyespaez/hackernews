import React, { Component } from 'react';
import './App.css';

const DEFAULT_QUERY = 'redux';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';

// function isSearched(query) {
//   return function(item) {
//     return !query || item.title.toLowerCase().indexOf(query.toLowerCase()) !== -1;
//   }
// }

class App extends Component {

  constructor(props) {
    super(props);

    // Aquí se definió el estado inicial de la aplicación
    this.state = {
      result: null,
      query: DEFAULT_QUERY,
    };

    // Se usa el mismo estado inicial para la primera petición
    this.setSearchTopstories = this.setSearchTopstories.bind(this);
    this.fetchSearchTopstories = this.fetchSearchTopstories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
  }

  onSearchSubmit(event) {
    const { query } = this.state;
    this.fetchSearchTopstories(query);
    event.preventDefault();
  }

  setSearchTopstories(result) {
    this.setState({ result });
  }

  // Ahora podemos usar el fetch nativo del API y dado que las
  // plantillas ES6 ayudan a crear
  fetchSearchTopstories(query) {
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${query}`)
      .then(response => response.json())
      .then(result => this.setSearchTopstories(result));
  }

  // Se usa éste método LF para extraer los datos después de que
  // el componente ha sido montado.
  componentDidMount() {
      const { query } = this.state;
      this.fetchSearchTopstories(query);
  }

  onSearchChange(event) {
    this.setState({ query: event.target.value });
  }

  render() {
    const { query, result } = this.state;
    return (
      <div className="page">
        <div className="interactions">
          <Search value={query} onChange={this.onSearchChange} onSubmit={this.onSearchSubmit}>
            Search
          </Search>
        </div>
        { result && <Table list={result.hits} /> }
      </div>
    );
  }
}

  const Search = ({ value, onChange, onSubmit, children }) =>
    <form onSubmit={onSubmit}>
      <input type="text" value={value} onChange={onChange} />
      <button type="submit">{children}</button>
    </form>

  const Table = ({ list }) => {
    console.log(list);
    return ( <div className="table">
    { list.map((item) =>
      <div key={item.objectID} className="table-row">
        <span style={{ width: '40%' }}>
          <a href={item.url}>{item.title}</a>
        </span>
        <span style={{ width: '30%' }}>
          {item.author}
        </span>
        <span style={{ widht: '15%' }}>
          {item.num_comments}
        </span>
        <span style={{ widht: '15%' }}>
          {item.points}
        </span>
      </div>
    )}
  </div> )
}

export default App;
