import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Phone, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuthActions } from '../../services/authActions';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthActions();
  const [formData, setFormData] = useState({
    phoneNumber: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'phoneNumber') {
      // Only allow digits and limit to 10 characters
      const numericValue = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({
        ...prev,
        [name]: numericValue
      }));
      
      // Validate phone number
      if (numericValue.length > 0 && numericValue.length < 10) {
        setPhoneError('Phone number must be exactly 10 digits');
      } else if (numericValue.length === 10) {
        setPhoneError('');
      } else {
        setPhoneError('');
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setPhoneError('');
    
    // Validate phone number before submission
    if (formData.phoneNumber.length !== 10) {
      setPhoneError('Phone number must be exactly 10 digits');
      setIsLoading(false);
      return;
    }
    
    try {
      // Use AuthContext login method which updates Redux store
      await login({
        phoneNumber: formData.phoneNumber,
        password: formData.password
      });
      
      // Navigate to the main app after successful login
      navigate('/overview');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        {/* Logo and Header */}
        <div className="text-center">
          {/* Logo Container - Simple and Clean */}
          <div className="flex justify-center mb-4">
            <div className="bg-white rounded-full p-4 shadow-lg border border-gray-200">
              <img src={logo} alt="BrickPool Logo" className="h-12 w-12" />
            </div>
          </div>
          
          {/* Admin Badge - Simple */}
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-red-50 border border-red-200 mb-4">
            <Shield className="w-4 h-4 text-red-600 mr-2" />
            <span className="text-sm font-medium text-red-700">ADMIN ACCESS ONLY</span>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            BrickPool Admin Portal
          </h2>
          <p className="text-sm text-gray-600">
            Authorized personnel only
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-sm">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Phone Number Field */}
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    required
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="Enter 10-digit phone number"
                    maxLength={10}
                    className={`w-full pl-9 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      phoneError 
                        ? 'border-red-300 bg-red-50' 
                        : formData.phoneNumber.length === 10 
                        ? 'border-green-300 bg-green-50' 
                        : 'border-gray-300 bg-white'
                    }`}
                  />
                  {formData.phoneNumber.length === 10 && !phoneError && (
                    <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 w-4 h-4" />
                  )}
                  {phoneError && (
                    <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 w-4 h-4" />
                  )}
                </div>
                {phoneError && (
                  <p className="mt-1 text-xs text-red-600 font-medium flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {phoneError}
                  </p>
                )}
                {formData.phoneNumber.length > 0 && formData.phoneNumber.length < 10 && (
                  <p className="mt-1 text-xs text-gray-500">
                    {formData.phoneNumber.length}/10 digits
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    className="w-full pl-9 pr-9 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-700 transition-colors">
                  Forgot password?
                </a>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading || formData.phoneNumber.length !== 10}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
