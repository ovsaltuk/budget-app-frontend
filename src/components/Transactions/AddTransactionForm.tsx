import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Grid,
  Alert
} from '@mui/material';
import { useTransactions } from '../../hooks/useTransactions';

interface IAddTransactionFormProps {
  onSuccess?: () => void;
}

const AddTransactionForm: React.FC<IAddTransactionFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    type: 'expense' as 'income' | 'expense',
    amount: '',
    date: new Date().toISOString().split('T')[0], // Сегодняшняя дата
    category: '',
    subcategory: '',
    description: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const { createTransaction } = useTransactions();

  const categories = {
    income: ['Зарплата', 'Фриланс', 'Инвестиции', 'Подарки', 'Прочее'],
    expense: ['Еда', 'Транспорт', 'Жилье', 'Развлечения', 'Здоровье', 'Образование', 'Прочее']
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await createTransaction({
        type: formData.type,
        amount: parseFloat(formData.amount),
        date: new Date(formData.date).toISOString(),
        category: formData.category,
        subcategory: formData.subcategory || undefined,
        description: formData.description || undefined
      });

      // Сброс формы
      setFormData({
        type: 'expense',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        category: '',
        subcategory: '',
        description: ''
      });

      if (onSuccess) {
        onSuccess();
      }

    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка при создании транзакции');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box pt={2}>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid size={12}>
            <TextField
              select
              fullWidth
              name="type"
              label="Тип"
              value={formData.type}
              onChange={handleInputChange}
              required
            >
              <MenuItem value="income">Доход</MenuItem>
              <MenuItem value="expense">Расход</MenuItem>
            </TextField>
          </Grid>

          <Grid size={12}>
            <TextField
              fullWidth
              name="amount"
              label="Сумма"
              type="number"
              value={formData.amount}
              onChange={handleInputChange}
              required
            />
          </Grid>

          <Grid size={12}>
            <TextField
              fullWidth
              name="date"
              label="Дата"
              type="date"
              value={formData.date}
              onChange={handleInputChange}
              required
            />
          </Grid>

          <Grid size={12}>
            <TextField
              select
              fullWidth
              name="category"
              label="Категория"
              value={formData.category}
              onChange={handleInputChange}
              required
            >
              {categories[formData.type].map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={12}>
            <TextField
              fullWidth
              name="subcategory"
              label="Подкатегория (опционально)"
              value={formData.subcategory}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid size={12}>
            <TextField
              fullWidth
              name="description"
              label="Описание (опционально)"
              value={formData.description}
              onChange={handleInputChange}
              multiline
              rows={1}
            />
          </Grid>

          <Grid size={12}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isLoading}
              fullWidth
            >
              {isLoading ? 'Добавление...' : 'Добавить транзакцию'}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default AddTransactionForm;