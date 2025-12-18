import { useState } from 'react';
import styles from './signup.module.css';

export function Signup() {
  // State for all form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    // Basic validation check
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    console.log('Registering user:', { name, email, password });
    alert(`Account created for ${name}!`);
    // This is where you'll eventually call your 'auth-api'
  };

  return (
    <div className={styles.container}>
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        
        <div className={styles.inputGroup}>
          <label htmlFor="name">Full Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="email">Email Address:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@example.com"
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
            placeholder="Choose a strong password"
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repeat your password"
            required
          />
        </div>

        <button type="submit" className={styles.signupButton}>
          Sign Up
        </button>
      </form>

      <p>
        Already have an account? <a href="/login">Login here</a>
      </p>
    </div>
  );
}

export default Signup;