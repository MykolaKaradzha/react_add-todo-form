import './App.scss';
import React, { useState } from 'react';
import usersFromServer from './api/users';
import todosFromServer from './api/todos';
import { TodoList } from './components/TodoList';
import { Todo } from './types/Todo';

export const App = () => {
  const MY_REGEX = /[^a-z-а-я-0-9-' ']/gi;

  const [todos, setTodos] = useState<Todo[]>(todosFromServer);
  const [userId, setUserId] = useState<number>(0);
  const [title, setTitle] = useState<string>('');
  const [errorTitle, setErrorTitle] = useState<boolean>(false);
  const [errorUser, setErrorUser] = useState<boolean>(false);

  const addUser = () => {
    const newId = Math.max(...todos.map(({ id }) => id)) + 1;

    setTodos((prevState) => (
      [
        ...prevState,
        {
          id: newId,
          title,
          completed: false,
          userId,
        }]));
  };

  const handleSubmitButton = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!userId) {
      setErrorUser(true);
    }

    if (!title.trim()) {
      setErrorTitle(true);
    }

    if (userId && title) {
      addUser();
      setUserId(0);
      setTitle('');
    }
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value.replace(MY_REGEX, ''));
    setErrorTitle(false);
  };

  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setUserId(+event.target.value);
    setErrorUser(false);
  };

  return (
    <div className="App">
      <h1>Add todo form</h1>

      <form action="/api/users" method="POST">
        <div className="field">
          <label>
            {'Title: '}
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              data-cy="titleInput"
              placeholder="Enter a title"
            />
          </label>
          {errorTitle && <span className="error">Please, enter a title</span>}
        </div>

        <div className="field">
          <label>
            {'User: '}
            <select
              name="user"
              data-cy="userSelect"
              value={userId}
              onChange={handleSelect}
            >
              <option value="0" disabled>Choose a user</option>
              {
                usersFromServer.map(user => (
                  <option value={user.id} key={user.id}>{user.name}</option>))
              }
            </select>
          </label>
          {errorUser && <span className="error">Please, choose a user</span>}
        </div>

        <button
          type="submit"
          data-cy="submitButton"
          onClick={handleSubmitButton}
        >
          Add
        </button>
      </form>
      <TodoList todos={todos} users={usersFromServer} />
    </div>
  );
};
