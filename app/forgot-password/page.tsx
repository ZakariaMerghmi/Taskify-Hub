
'use client';
import React, { useState } from 'react';
import { useGlobalContext } from '../components/contextAPI';
import { faFeather, faArrowLeft, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { isdark, Auth } = useGlobalContext();
  const { resetPassword } = Auth;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsSubmitting(true);

    try {
      await resetPassword(email);
      setMessage('Password reset email sent! Check your inbox and follow the instructions to reset your password.');
      setEmail(''); 
    } catch (err: any) {
      console.error('Password reset error:', err);
      setError(err.message || 'Failed to send password reset email');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
   
    if (error) setError('');
    if (message) setMessage('');
  };

  return (
    <div className={`min-h-screen flex flex-col justify-center items-center 
      ${isdark ? 'bg-blue-950 text-white' : 'bg-gray-50 text-gray-800'}`}>
      
      <div className={`w-full max-w-md p-8 rounded-lg shadow-lg 
        ${isdark ? 'bg-blue-900' : 'bg-white'}`}>
        
        <div className='flex gap-2 items-center justify-center mb-8'>
          <FontAwesomeIcon
            icon={faFeather}
            className='text-white text-xl font-bold bg-blue-500 p-2 rounded-sm' />
          <span className='text-2xl font-light'>
            <span className='text-blue-500 font-bold'>Focusly</span> 
          </span>
        </div>

        <h2 className='text-2xl font-bold mb-2 text-center'>
          Reset your password
        </h2>
        
        <p className='text-center text-gray-600 dark:text-gray-300 mb-6 text-sm'>
          Enter your email address and we'll send you a link to reset your password.
        </p>

        {error && (
          <div className='mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm'>
            {error}
          </div>
        )}

        {message && (
          <div className='mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md text-sm'>
            <div className='flex items-center gap-2'>
              <FontAwesomeIcon icon={faEnvelope} />
              <span>{message}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-6'>
          <div>
            <label htmlFor='email' className='block mb-2 text-sm font-medium'>
              Email address
            </label>
            <input
              type='email'
              name='email'
              id='email'
              value={email}
              onChange={handleChange}
              autoComplete='username'
              className={`w-full p-3 rounded-md border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors
                ${isdark ? 'bg-blue-800 border-blue-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              placeholder='name@company.com'
              required
              disabled={isSubmitting}
            />
          </div>

          <button
            type='submit'
            disabled={isSubmitting}
            className={`w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-md transition-colors flex items-center justify-center
              ${isSubmitting ? 'opacity-75' : ''}`}
          >
            {isSubmitting ? (
              <div className='flex items-center gap-2'>
                <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                <span>Sending reset email...</span>
              </div>
            ) : (
              <span>Send reset email</span>
            )}
          </button>
        </form>

        <div className='mt-6 text-center'>
          <Link
            href='/authentication'
            className='inline-flex items-center gap-2 text-blue-500 hover:underline'
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            <span>Back to sign in</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;