'use client';

import { useState } from 'react';
import { signUp } from '@/lib/firebase/firebase';

export function SignUpForm() {
  const [username, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    await signUp(username, email, password);
  };

  return (
    <form onSubmit={handleSignUp}>
      <div>
        <div>
          <label htmlFor='name'>User name</label>
          <input
            id='username'
            name='username'
            placeholder='User name'
            value={username}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor='email'>Email</label>
          <input
            id='email'
            name='email'
            type='email'
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor='password'>Password</label>
          <input
            id='password'
            name='password'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type='submit'>Sign Up</button>
      </div>
    </form>
  );
}
