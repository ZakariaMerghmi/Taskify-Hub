'use client';
import React, { useState, useEffect } from 'react';
import { useGlobalContext } from '../components/contextAPI';
import { faFeather, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isdark, Auth } = useGlobalContext();
  const { user, login, signup, loading } = Auth;
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });

  
  useEffect(() => {
    if (user && !loading) {
      router.push('/'); 
    }
  }, [user, loading, router]);

 
  if (loading) {
    return (
      <div className={`min-h-screen flex justify-center items-center 
        ${isdark ? 'bg-blue-950' : 'bg-gray-50'}`}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-blue-500 text-lg">Loading...</div>
        </div>
      </div>
    );
  }

 
  if (user) {
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        if (!formData.name.trim()) {
          setError('Name is required');
          return;
        }
        await signup(formData.name, formData.email, formData.password);
      }
      
      
      router.push('/');
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoAccess = async () => {
    setError('');
    setIsSubmitting(true);
    
    try {
      
      await Auth.loginDemo();
      router.push('/');
    } catch (err: any) {
      console.error('Demo access error:', err);
      setError(err.message || 'Demo access temporarily unavailable');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setFormData({
      email: '',
      password: '',
      name: ''
    });
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
            <span className='text-blue-500 font-bold'>Foxly</span> 
          </span>
        </div>

        <h2 className='text-2xl font-bold mb-6 text-center'>
          {isLogin ? 'Login to your account' : 'Create an account'}
        </h2>

        
        <div className='mb-6'>
          <button
            onClick={handleDemoAccess}
            disabled={isSubmitting}
            className={`w-full border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed font-medium py-3 px-4 rounded-md transition-colors flex items-center justify-center mb-4
              ${isSubmitting ? 'opacity-75' : ''}`}
          >
            {isSubmitting ? (
              <div className='flex items-center gap-2'>
                <div className='w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin'></div>
                <span>Accessing Demo...</span>
              </div>
            ) : (
              <span>🚀 Try Demo Access</span>
            )}
          </button>
          
          <div className='text-center'>
            <div className={`text-sm ${isdark ? 'text-gray-300' : 'text-gray-500'} mb-2`}>
              — OR —
            </div>
          </div>
        </div>

        {error && (
          <div className='mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm'>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-6'>
          {!isLogin && (
            <div>
              <label htmlFor='name' className='block mb-2 text-sm font-medium'>
                Your Name
              </label>
              <input
                type='text'
                name='name'
                id='name'
                value={formData.name}
                onChange={handleChange}
                autoComplete='name'
                className={`w-full p-3 rounded-md border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors
                  ${isdark ? 'bg-blue-800 border-blue-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                placeholder='John Doe'
                required
                disabled={isSubmitting}
              />
            </div>
          )}

          <div>
            <label htmlFor='email' className='block mb-2 text-sm font-medium'>
              Email address
            </label>
            <input
              type='email'
              name='email'
              id='email'
              value={formData.email}
              onChange={handleChange}
              autoComplete='username'
              className={`w-full p-3 rounded-md border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors
                ${isdark ? 'bg-blue-800 border-blue-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              placeholder='name@company.com'
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor='password' className='block mb-2 text-sm font-medium'>
              Password
            </label>
            <div className='relative'>
              <input
                type={showPassword ? 'text' : 'password'}
                name='password'
                id='password'
                value={formData.password}
                onChange={handleChange}
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                className={`w-full p-3 pr-10 rounded-md border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors
                  ${isdark ? 'bg-blue-800 border-blue-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                placeholder='••••••••'
                required
                disabled={isSubmitting}
                minLength={6}
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600'
                disabled={isSubmitting}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
          </div>

          {isLogin && (
            <div className='flex items-center justify-between'>
              <div className='flex items-center'>
                <input
                  id='remember-me'
                  name='remember-me'
                  type='checkbox'
                  className='h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                  disabled={isSubmitting}
                />
                <label htmlFor='remember-me' className='ml-2 block text-sm'>
                  Remember me
                </label>
              </div>
              <Link href='/forgot-password' className='text-sm text-blue-500 hover:underline'>
                Forgot password?
              </Link>
            </div>
          )}

          <button
            type='submit'
            disabled={isSubmitting}
            className={`w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-md transition-colors flex items-center justify-center
              ${isSubmitting ? 'opacity-75' : ''}`}
          >
            {isSubmitting ? (
              <div className='flex items-center gap-2'>
                <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                <span>{isLogin ? 'Signing in...' : 'Creating account...'}</span>
              </div>
            ) : (
              <span>{isLogin ? 'Sign in' : 'Sign up'}</span>
            )}
          </button>
        </form>

        <div className='mt-6 text-center'>
          <button
            onClick={toggleAuthMode}
            className='text-blue-500 hover:underline'
            disabled={isSubmitting}
          >
            {isLogin ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;