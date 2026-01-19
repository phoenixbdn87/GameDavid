import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function LoginModal() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(username, password);

    if (!result.success) {
      setError(result.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="login-overlay">
      <div className="login-modal">
        <div className="login-header">
          <img
            src="/logo_header.png"
            alt="Game Collection"
            className="login-logo"
          />
          <h2 className="login-title">Iniciar Sesion</h2>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="login-error">
              <i className="bi bi-exclamation-triangle-fill"></i>
              {error}
            </div>
          )}

          <div className="login-field">
            <label htmlFor="username">
              <i className="bi bi-person-fill"></i>
              Usuario
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ingresa tu usuario"
              required
              autoFocus
            />
          </div>

          <div className="login-field">
            <label htmlFor="password">
              <i className="bi bi-lock-fill"></i>
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa tu contraseña"
              required
            />
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Verificando...
              </>
            ) : (
              <>
                <i className="bi bi-box-arrow-in-right"></i>
                Entrar
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          <i className="bi bi-controller"></i>
          Game Collection
        </div>
      </div>
    </div>
  );
}

export default LoginModal;
