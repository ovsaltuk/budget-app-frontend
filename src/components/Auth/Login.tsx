import React, { useState } from 'react';
import { Box, Typography, Paper, TextField, Button, Alert } from '@mui/material';
import { authService } from '../../services/authService';
import { useAuth } from '../../hooks/useAuth';
import { getErrorMessage } from '../../types/api';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    login: '',
    password: '',
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
    // Очищаем ошибку при изменении поля
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Вызываем API сервис
      const response = await authService.login(formData);

      // Сохраняем данные в контекст аутентификации
      login(response.token, response.user);

      console.log('Успешный вход:', response);

    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      console.error('Ошибка входа:', err);
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
        padding: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          width: '100%',
          maxWidth: 400,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Вход в систему
        </Typography>

        {/* Показываем ошибку если есть */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            fullWidth
            name="login"
            label="Email или логин"
            value={formData.login}
            onChange={handleInputChange}
            margin="normal"
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
            margin="normal"
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
            {isLoading ? 'Загрузка...' : 'Войти'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;