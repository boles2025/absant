
import React, { useState } from 'react';

interface LoginProps {
  onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsLoggingIn(true);

    // Simulate a check
    setTimeout(() => {
      if (password === '8520') {
        onLoginSuccess();
      } else {
        setError('كلمة المرور غير صحيحة. يرجى المحاولة مرة أخرى.');
        setPassword('');
      }
      setIsLoggingIn(false);
    }, 500);
  };

  return (
    <div className="container mx-auto px-4 py-8 flex justify-center items-start mt-10">
      <div className="bg-slate-800 p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-500 hover:scale-105">
        <h2 className="text-3xl font-bold text-center mb-6 text-teal-400">تسجيل الدخول للوحة التحكم</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-slate-300">كلمة المرور</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-slate-700 border border-slate-600 text-white text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-2.5 transition text-center"
              autoFocus
            />
          </div>
          {error && <p className="text-center text-red-400 text-sm animate-pulse">{error}</p>}
          <div className="pt-2">
            <button type="submit" disabled={isLoggingIn} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:bg-slate-500 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105">
              {isLoggingIn ? 'جاري التحقق...' : 'دخول'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
