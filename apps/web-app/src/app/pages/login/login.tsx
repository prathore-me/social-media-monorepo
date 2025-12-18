import { useState } from 'react';
import styles from './login.module.css';

export function Login() {
  // 1. State: This is how React "remembers" what you type into the boxes
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 2. The function that runs when you click the button
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault(); // Prevents the browser from refreshing the page
    console.log('Logging in with:', { email, password });
    alert(`Trying to login with: ${email}`);
    // Later, you will add your API call here to talk to your auth-api
  };

  return (
    <div className={styles.container}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        
        <div className={styles.inputGroup}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="enter your email"
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="enter your password"
            required
          />
        </div>

        <button type="submit" className={styles.loginButton}>
          Sign In
        </button>
        
      </form>
      <p>
        Don't have an account? <a href="/signup">Sign up here</a>
      </p>
    </div>
  );
}

export default Login;