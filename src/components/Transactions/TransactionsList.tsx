import React, { useEffect, useState } from 'react';
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
    IconButton,
    Checkbox
} from '@mui/material';
import { useTransactions } from '../../hooks/useTransactions';
import type { ITransaction } from '../../types/transactions';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

interface ITransactionListProps {
    transactions: ITransaction[];
    onDelete?: () => void;
}

const TransactionList: React.FC<ITransactionListProps> = ({ transactions, onDelete }) => {
    const { deleteTransaction, deleteTransactions } = useTransactions();
    const [selected, setSelected] = useState<number[]>([]);

    useEffect(() => { }, [selected])

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

    const handleDeleteMultiple = async (ids: number[]) => {
        if (window.confirm('Вы уверены, что хотите удалить эту транзакции?')) {
            try {
                await deleteTransactions(ids);
                setSelected([]);
            } catch (error) {
                console.error('Ошибка при удалении транзакций:', error)
            } finally {
                onDelete?.();
            }
        }
    }

    // Обработчик выбора/снятия выбора отдельного элемента
    const handleSelect = (id: number) => {
        if (selected.includes(id)) {
            setSelected(selected.filter(item => item !== id));
        } else {
            setSelected([...selected, id]);
        }
    };

    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            setSelected(transactions.map(transaction => transaction.id));
        } else {
            setSelected([]);
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
                        <TableCell width={50}>
                            <Checkbox onChange={handleSelectAll} />
                        </TableCell>
                        <TableCell width={200} align='left'>Дата</TableCell>
                        <TableCell width={200} align='left'>Тип</TableCell>
                        <TableCell width={250} align='left'>Категория</TableCell>
                        <TableCell align="left">Описание</TableCell>
                        <TableCell align="center" width={150}>Сумма</TableCell>
                        <TableCell align="center" width={110}>
                            <IconButton size="small" onClick={() => { handleDeleteMultiple(selected) }}>
                                <DeleteForeverIcon />
                            </IconButton>
                        </TableCell>

                    </TableRow>
                </TableHead>
                <TableBody>
                    {transactions.map((transaction) => (
                        <TableRow
                            key={transaction.id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell align="left">
                                <Checkbox onChange={() => handleSelect(transaction.id)} checked={selected.includes(transaction.id) ? true : false} />
                            </TableCell>
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
                            <TableCell align="center">
                                <Chip
                                    label={formatCurrency(transaction.amount)}
                                    color={transaction.type === 'income' ? 'success' : 'error'}
                                    variant="outlined"
                                />
                            </TableCell>
                            <TableCell align="center" >
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