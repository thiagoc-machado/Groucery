import './App.css';
import { useState, useEffect } from 'react';
import { BsTrash, BsBookmarkCheck, BsBookmarkCheckFill } from 'react-icons/bs';

const API = 'http://localhost:5000';

function App() {
  let [title, setTitle] = useState('');
  let [time, setTime] = useState('');
  const [todos, setTodos] = useState([]);
  const [loading, setLoadind] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoadind(true);

      const res = await fetch(API + '/todos')
        // const res = await fetch(
        //   'https://api.jsonbin.io/v3/b/63d6f210ace6f33a22cd2479/latest'
        // )
        .then((res) => res.json())
        .then((data) => data)
        //.then((res) => res.record)
        .catch((err) => console.log(err));

      setLoadind(false);
      setTodos(res);
      //setTodos([res]);
    };

    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const todo = {
      id: Math.random(),
      title,
      time,
      done: false,
    };

    await fetch(API + '/todos', {
      method: 'POST',
      body: JSON.stringify(todo),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    //  let req = new XMLHttpRequest();

    //   req.onreadystatechange = () => {
    //     if (req.readyState === XMLHttpRequest.DONE) {
    //       console.log(req.responseText);
    //     }
    //   };
    //   req.open(
    //     'PUT',
    //     'https://api.jsonbin.io/v3/b/63d6f210ace6f33a22cd2479',
    //     true
    //   );
    //   req.setRequestHeader('Content-Type', 'application/json');
    //   req.send(JSON.stringify(todo));

    setTodos((prevState) => [...prevState, todo]);
    console.log(todo);
    setTitle('');
    setTime('');
  };

  const hanleDelete = async (id) => {
    await fetch(API + '/todos/' + id, {
      method: 'DELETE',
    });

    setTodos((prevState) => prevState.filter((todo) => todo.id !== id));
  };

  const handleEdit = async (todo) => {
    todo.done = !todo.done;

    const data = await fetch(API + '/todos/' + todo.id, {
      method: 'PUT',
      body: JSON.stringify(todo),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    setTodos((prevState) =>
      prevState.map((t) => (t.id === data.id ? t - data : t))
    );
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <div className='App'>
      <div className='todo-header'>
        <h1>Lista de compras</h1>
      </div>
      <div className='form-todo'>
        <p></p>
        <h2>Inserir item na lista</h2>
        <form onSubmit={handleSubmit}>
          <div className='inputs'>
            <div className='form-control-title'>
              <label htmlFor='title'>O que voce precisa?</label>
              <input
                type='text'
                name='title'
                placeholder='Nome do produto'
                onChange={(e) => setTitle(e.target.value)}
                value={title || ''}
                required
              />
            </div>
            <div className='form-control-qtd'>
              <label htmlFor='time'>Quantidade</label>
              <input
                type='number'
                name='time'
                placeholder='Quantidade'
                onChange={(e) => setTime(e.target.value)}
                value={time || ''}
                required
              />
            </div>
          </div>
          <input type='submit' value='Adicionar a lista' />
        </form>
      </div>
      <div className='list-todo'>
        <h2>Lista de tarefas</h2>
        {todos.length === 0 && <p>Não há items</p>}
        {todos.map((todo) => (
          <div className='todo' key={todo.id}>
            <h3 className={todo.done ? 'todo-done' : ''}>{todo.title}</h3>
            <p>Quantidade: {todo.time}</p>
            <div className='actions'>
              <span onClick={() => handleEdit(todo)}>
                {!todo.done ? <BsBookmarkCheck /> : <BsBookmarkCheckFill />}
              </span>
              <BsTrash onClick={() => hanleDelete(todo.id)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
