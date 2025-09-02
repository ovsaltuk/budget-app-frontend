import React, { useRef, useState } from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
  Alert,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { UploadFile, Download, Delete } from '@mui/icons-material';
import { ExcelImportService } from '../../services/excelImportService';
import { useTransactions } from '../../hooks/useTransactions';

interface IExcelImportProps {
  onImportSuccess?: () => void; // Добавляем callback для успешного импорта
}

const ExcelImport: React.FC<IExcelImportProps> = ({ onImportSuccess }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parsedTransactions, setParsedTransactions] = useState<any[]>([]);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const { createTransaction, loadTransactions } = useTransactions(); // Добавляем loadTransactions

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setError('');
    setIsLoading(true);

    try {
      const transactions = await ExcelImportService.parseExcelFile(file);
      setParsedTransactions(transactions);
    } catch (err: any) {
      setError(err.message || 'Ошибка при обработке файла');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImport = async () => {
    if (parsedTransactions.length === 0) return;

    setIsLoading(true);
    setError('');

    try {
      let successCount = 0;
      let errorCount = 0;

      // Импортируем все транзакции
      for (const transaction of parsedTransactions) {
        try {
          await createTransaction(transaction);
          successCount++;
        } catch (err) {
          console.error('Error importing transaction:', transaction, err);
          errorCount++;
        }
      }

      // Перезагружаем список транзакций
      await loadTransactions();
      
      // Вызываем callback для обновления родительского компонента
      if (onImportSuccess) {
        onImportSuccess();
      }

      setParsedTransactions([]);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Показываем детальный отчет
      if (errorCount > 0) {
        alert(`Импорт завершен!\nУспешно: ${successCount}\nС ошибками: ${errorCount}`);
      } else {
        alert(`Успешно импортировано ${successCount} транзакций!`);
      }
      
    } catch (err: any) {
      setError('Ошибка при импорте транзакций');
      console.error('Import error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadTemplate = () => {
    ExcelImportService.downloadTemplate();
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setParsedTransactions([]);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Импорт из Excel
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
        <Button
          variant="outlined"
          startIcon={<Download />}
          onClick={handleDownloadTemplate}
          disabled={isLoading}
        >
          Скачать шаблон
        </Button>

        <Button
          variant="contained"
          component="label"
          startIcon={<UploadFile />}
          disabled={isLoading}
        >
          Загрузить Excel
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            hidden
            onChange={handleFileSelect}
          />
        </Button>

        {selectedFile && (
          <Button
            variant="outlined"
            color="error"
            startIcon={<Delete />}
            onClick={clearSelection}
            disabled={isLoading}
          >
            Очистить
          </Button>
        )}
      </Box>

      {selectedFile && (
        <Typography variant="body2" sx={{ mb: 2 }}>
          Выбран файл: {selectedFile.name}
        </Typography>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {parsedTransactions.length > 0 && (
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Найдено транзакций: {parsedTransactions.length}
          </Typography>
          
          <List dense sx={{ maxHeight: 200, overflow: 'auto', mb: 2 }}>
            {parsedTransactions.slice(0, 5).map((transaction, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={`${transaction.type === 'income' ? '✅' : '❌'} ${transaction.category} - ${transaction.amount} ₽`}
                  secondary={new Date(transaction.date).toLocaleDateString('ru-RU')}
                />
              </ListItem>
            ))}
            {parsedTransactions.length > 5 && (
              <ListItem>
                <ListItemText
                  primary={`... и еще ${parsedTransactions.length - 5} транзакций`}
                />
              </ListItem>
            )}
          </List>

          <Button
            variant="contained"
            onClick={handleImport}
            disabled={isLoading}
            fullWidth
          >
            {isLoading ? 'Импорт...' : `Импортировать ${parsedTransactions.length} транзакций`}
          </Button>
        </Box>
      )}
    </Paper>
  );
};

export default ExcelImport;