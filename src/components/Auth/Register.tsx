import React, { useState } from 'react';
import { Box, Typography, Paper, TextField, Button, Alert, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { authService } from '../../services/authService';
import { useAuth } from '../../hooks/useAuth';
import { getErrorMessage } from '../../types/api';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    login: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  
  const { login } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Валидация паролей
    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await authService.register({
        email: formData.email,
        login: formData.login,
        password: formData.password
      });
      
      login(response.token, response.user);
      console.log('Успешная регистрация:', response);
      
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      console.error('Ошибка регистрации:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        p: {xs: 1, sm:2}
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p:{ xs: 2, sm: 4},
          width: '100%',
          maxWidth: 400,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{fontSize: {xs: '1.5rem', sm: '2rem'}}}>
          Регистрация
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            name="email"
            type="email"
            label="Email"
            value={formData.email}
            onChange={handleInputChange}
            margin="dense"
            variant="outlined"
            required
            disabled={isLoading}
          />
          
          <TextField
            fullWidth
            name="login"
            label="Логин"
            value={formData.login}
            onChange={handleInputChange}
            margin="dense"
            variant="outlined"
            required
            disabled={isLoading}
          />
          
          <TextField
            fullWidth
            name="password"
            label="Пароль"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            margin="dense"
            variant="outlined"
            required
            disabled={isLoading}
          />
          
          <TextField
            fullWidth
            name="confirmPassword"
            label="Подтвердите пароль"
            type="password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            margin="dense"
            variant="outlined"
            required
            disabled={isLoading}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={isLoading}
            sx={{ mt: 3 }}
          >
            {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
          </Button>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Link component={RouterLink} to="/login" variant="body2">
              Уже есть аккаунт? Войти
            </Link>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Register;