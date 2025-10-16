import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Shield, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';

const ChangePassword: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear errors when user starts typing
    if (name === 'newPassword') {
      setPasswordErrors(prev => ({ ...prev, newPassword: '' }));
    } else if (name === 'confirmPassword') {
      setPasswordErrors(prev => ({ ...prev, confirmPassword: '' }));
    }
    setError('');
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validatePassword = (password: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return 'Password must be at least 8 characters long';
    }
    if (!hasUpperCase) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!hasLowerCase) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!hasNumbers) {
      return 'Password must contain at least one number';
    }
    if (!hasSpecialChar) {
      return 'Password must contain at least one special character';
    }
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess(false);
    setPasswordErrors({ newPassword: '', confirmPassword: '' });

    // Validate new password
    const newPasswordError = validatePassword(formData.newPassword);
    if (newPasswordError) {
      setPasswordErrors(prev => ({ ...prev, newPassword: newPasswordError }));
      setIsLoading(false);
      return;
    }

    // Validate password confirmation
    if (formData.newPassword !== formData.confirmPassword) {
      setPasswordErrors(prev => ({ 
        ...prev, 
        confirmPassword: 'Passwords do not match' 
      }));
      setIsLoading(false);
      return;
    }

    // Check if new password is different from old password
    if (formData.oldPassword === formData.newPassword) {
      setError('New password must be different from the current password');
      setIsLoading(false);
      return;
    }

    try {
      // TODO: Implement actual password change API call
      // const response = await changePasswordAPI({
      //   oldPassword: formData.oldPassword,
      //   newPassword: formData.newPassword
      // });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccess(true);
      setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      
      // Redirect to overview after successful password change
      setTimeout(() => {
        navigate('/overview');
      }, 2000);
      
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to change password. Please try again.');
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
            Change Password
          </h2>
          <p className="text-sm text-gray-600">
            Update your account password
          </p>
        </div>

        {/* Back Button */}
        <div className="flex justify-start">
          <button
            onClick={() => navigate('/overview')}
            className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Dashboard
          </button>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border-l-4 border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-sm">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              <span className="font-medium">Password changed successfully! Redirecting...</span>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-sm">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Change Password Form */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Current Password Field */}
              <div>
                <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    id="oldPassword"
                    name="oldPassword"
                    type={showPasswords.oldPassword ? 'text' : 'password'}
                    required
                    value={formData.oldPassword}
                    onChange={handleInputChange}
                    placeholder="Enter your current password"
                    className="w-full pl-9 pr-9 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('oldPassword')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                  >
                    {showPasswords.oldPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* New Password Field */}
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    id="newPassword"
                    name="newPassword"
                    type={showPasswords.newPassword ? 'text' : 'password'}
                    required
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    placeholder="Enter your new password"
                    className={`w-full pl-9 pr-9 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      passwordErrors.newPassword 
                        ? 'border-red-300 bg-red-50' 
                        : formData.newPassword.length > 0 && !passwordErrors.newPassword
                        ? 'border-green-300 bg-green-50' 
                        : 'border-gray-300 bg-white'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('newPassword')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                  >
                    {showPasswords.newPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                  {formData.newPassword.length > 0 && !passwordErrors.newPassword && (
                    <CheckCircle className="absolute right-10 top-1/2 transform -translate-y-1/2 text-green-500 w-4 h-4" />
                  )}
                  {passwordErrors.newPassword && (
                    <AlertCircle className="absolute right-10 top-1/2 transform -translate-y-1/2 text-red-500 w-4 h-4" />
                  )}
                </div>
                {passwordErrors.newPassword && (
                  <p className="mt-1 text-xs text-red-600 font-medium flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {passwordErrors.newPassword}
                  </p>
                )}
                {formData.newPassword.length > 0 && !passwordErrors.newPassword && (
                  <p className="mt-1 text-xs text-green-600 font-medium flex items-center">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Password meets all requirements
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPasswords.confirmPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your new password"
                    className={`w-full pl-9 pr-9 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      passwordErrors.confirmPassword 
                        ? 'border-red-300 bg-red-50' 
                        : formData.confirmPassword.length > 0 && formData.newPassword === formData.confirmPassword
                        ? 'border-green-300 bg-green-50' 
                        : 'border-gray-300 bg-white'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirmPassword')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                  >
                    {showPasswords.confirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                  {formData.confirmPassword.length > 0 && formData.newPassword === formData.confirmPassword && (
                    <CheckCircle className="absolute right-10 top-1/2 transform -translate-y-1/2 text-green-500 w-4 h-4" />
                  )}
                  {passwordErrors.confirmPassword && (
                    <AlertCircle className="absolute right-10 top-1/2 transform -translate-y-1/2 text-red-500 w-4 h-4" />
                  )}
                </div>
                {passwordErrors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-600 font-medium flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {passwordErrors.confirmPassword}
                  </p>
                )}
                {formData.confirmPassword.length > 0 && formData.newPassword === formData.confirmPassword && (
                  <p className="mt-1 text-xs text-green-600 font-medium flex items-center">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Passwords match
                  </p>
                )}
              </div>
            </div>

            {/* Password Requirements */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Password Requirements:</h4>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• At least 8 characters long</li>
                <li>• Contains uppercase and lowercase letters</li>
                <li>• Contains at least one number</li>
                <li>• Contains at least one special character</li>
                <li>• Different from your current password</li>
              </ul>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading || !formData.oldPassword || !formData.newPassword || !formData.confirmPassword || !!passwordErrors.newPassword || !!passwordErrors.confirmPassword}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Changing password...
                  </div>
                ) : (
                  'Change Password'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;