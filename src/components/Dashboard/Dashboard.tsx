import React from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import { useAuth } from '../../hooks/useAuth';
import { useTransactions } from '../../hooks/useTransactions';
import TransactionList from '../Transactions/TransactionsList';
import AddTransactionForm from '../Transactions/AddTransactionForm';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { transactions, isLoading, loadTransactions } = useTransactions();

  // Расчет статистики
  const calculateStats = () => {
    let totalIncome = 0;
    let totalExpense = 0;
    let transactionCount = 0;

    transactions.forEach(transaction => {
      if (transaction.type === 'income') {
        totalIncome += transaction.amount;
      } else {
        totalExpense += transaction.amount;
      }
      transactionCount++;
    });

    const balance = totalIncome - totalExpense;

    return {
      totalIncome,
      totalExpense,
      balance,
      transactionCount
    };
  };

  const { totalIncome, totalExpense, balance, transactionCount } = calculateStats();

  const updateTransactions = () => {
    loadTransactions(); // Перезагружаем список транзакций
  };

  // Форматирование чисел в рублях
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB'
    }).format(amount);
  };

  return (
    <Container maxWidth={false} sx={{ mt: 4, mb: 4 }}>
      {/* Заголовок и кнопка выхода */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 4,
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 2, sm: 0 }
      }}>
        <Typography variant="h4" component="h1">
          Добро пожаловать, {user?.login}!
        </Typography>
        <Button
          variant="outlined"
          onClick={logout}
          size="large"
        >
          Выйти
        </Button>
      </Box>

      <Grid container spacing={{ xs: 1, sm: 2 }} mb={4}>
        <Grid size={{ xs: 6, sm: 3 }}>
          {/* Доходы карточка */}
          <Box >
            <Card elevation={3}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Доходы
                </Typography>
                <Typography variant="h5" component="div" color="success.main">
                  {isLoading ? '...' : formatCurrency(totalIncome)}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>

          {/* Расходы карточка */}
          <Box >
            <Card elevation={3}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Расходы
                </Typography>
                <Typography variant="h5" component="div" color="error.main">
                  {isLoading ? '...' : formatCurrency(totalExpense)}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          {/* Баланс карточка */}
          <Box >
            <Card elevation={3}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Баланс
                </Typography>
                <Typography variant="h5" component="div">
                  {isLoading ? '...' : formatCurrency(balance)}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          {/* Кол-во транзакций карточка */}
          <Box >
            <Card elevation={3}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Транзакций
                </Typography>
                <Typography variant="h5" component="div">
                  {isLoading ? '...' : transactionCount}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>
      {/* Заглушка для будущего контента */}
      <Paper
        elevation={2}
        sx={{
          textAlign: 'center',
          backgroundColor: 'grey.50'
        }}
      >
        <AddTransactionForm onSuccess={updateTransactions}/>
        <TransactionList transactions={transactions} onDelete={updateTransactions}/>
      </Paper>
    </Container>
  );
};

export default Dashboard;