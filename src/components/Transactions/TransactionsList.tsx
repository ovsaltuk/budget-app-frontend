import React from 'react';
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    IconButton
} from '@mui/material';
import { useTransactions } from '../../hooks/useTransactions';
import type { ITransaction } from '../../types/transactions';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

interface ITransactionListProps {
    transactions: ITransaction[];
    onDelete?: () => void;
}

const TransactionList: React.FC<ITransactionListProps> = ({ transactions, onDelete }) => {
    const { deleteTransaction } = useTransactions();

    const handleDelete = async (id: number) => {
        if (window.confirm('Вы уверены, что хотите удалить эту транзакцию?')) {
            try {
                await deleteTransaction(id);
            } catch (error) {
                console.error('Ошибка при удалении транзакции:', error);
            } finally {
                onDelete?.();
            }
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'RUB'
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ru-RU');
    };

    if (transactions.length === 0) {
        return (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography color="textSecondary">
                    Транзакций пока нет
                </Typography>
            </Paper>
        );
    }

    return (
        <TableContainer >
            <Table sx={{ minWidth: 650 }} aria-label="таблица транзакций">
                <TableHead>
                    <TableRow>
                        <TableCell>Дата</TableCell>
                        <TableCell>Тип</TableCell>
                        <TableCell>Категория</TableCell>
                        <TableCell>Описание</TableCell>
                        <TableCell align="right">Сумма</TableCell>
                        <TableCell align="center">Действия</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {transactions.map((transaction) => (
                        <TableRow
                            key={transaction.id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell>
                                {formatDate(transaction.date)}
                            </TableCell>
                            <TableCell>
                                {transaction.type === 'income' ? 'Доход' : 'Расход'}
                            </TableCell>
                            <TableCell>
                                <Box>
                                    <Typography variant="body2">{transaction.category}</Typography>
                                    {transaction.subcategory && (
                                        <Typography variant="caption" color="textSecondary">
                                            {transaction.subcategory}
                                        </Typography>
                                    )}
                                </Box>
                            </TableCell>
                            <TableCell>
                                {transaction.description || '-'}
                            </TableCell>
                            <TableCell align="right">
                                <Chip
                                    label={formatCurrency(transaction.amount)}
                                    color={transaction.type === 'income' ? 'success' : 'error'}
                                    variant="outlined"
                                />
                            </TableCell>
                            <TableCell align="center">
                                <IconButton
                                    size="small"
                                    onClick={() => {
                                        handleDelete(transaction.id);
                                    }}
                                    color="error"
                                >
                                    <DeleteForeverIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default TransactionList;