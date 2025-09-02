import * as XLSX from 'xlsx';
import type { ICreateTransactionData } from '../types/transactions';

export interface IExcelTransaction {
  Дата: string | number;
  Тип: string;
  Категория: string;
  Подкатегория?: string;
  Сумма: number;
  Описание?: string;
}

export class ExcelImportService {
  static async parseExcelFile(file: File): Promise<ICreateTransactionData[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          if (!e.target?.result) {
            throw new Error('Не удалось прочитать файл');
          }

          // Для простоты используем any, так как типы XLSX сложные
          const workbook = XLSX.read(e.target.result as ArrayBuffer, { 
            type: 'array',
            cellDates: true // Важно: парсим даты как Date объекты
          });
          
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          
          // Преобразуем в JSON
          const jsonData = XLSX.utils.sheet_to_json<IExcelTransaction>(worksheet, {
            raw: false, // Получаем отформатированные значения
            defval: '' // Значение по умолчанию для пустых ячеек
          });

          console.log('Raw Excel data:', jsonData); // Для дебага

          const transactions = jsonData.map(item => this.mapExcelToTransaction(item));
          resolve(transactions);

        } catch (error) {
          console.error('Excel parsing error:', error);
          reject(new Error('Ошибка при чтении Excel файла. Проверьте формат.'));
        }
      };

      reader.onerror = (error) => {
        console.error('FileReader error:', error);
        reject(new Error('Ошибка при чтении файла'));
      };

      reader.readAsArrayBuffer(file);
    });
  }

  private static mapExcelToTransaction(excelData: IExcelTransaction): ICreateTransactionData {
    // Приводим тип к нужному формату
    const type = excelData.Тип?.toString().toLowerCase().includes('доход') ? 'income' : 'expense';
    
    // Парсим дату
    let date: Date;
    try {
      if (excelData.Дата instanceof Date) {
        date = excelData.Дата;
      } else if (typeof excelData.Дата === 'number') {
        // Конвертируем Excel serial date (дни с 1900-01-01)
        date = new Date((excelData.Дата - 25569) * 86400 * 1000);
      } else if (typeof excelData.Дата === 'string') {
        date = new Date(excelData.Дата);
      } else {
        date = new Date();
      }
    } catch {
      date = new Date();
    }

    // Обрабатываем сумму
    let amount = Number(excelData.Сумма);
    if (isNaN(amount)) {
      amount = 0;
    }

    // Для расходов делаем сумму положительной
    if (type === 'expense' && amount > 0) {
      amount = -amount;
    }

    return {
      type,
      amount: Math.abs(amount), // Всегда положительное число
      date: date.toISOString(),
      category: excelData.Категория?.toString() || 'Не указана',
      subcategory: excelData.Подкатегория?.toString(),
      description: excelData.Описание?.toString()
    };
  }

  static downloadTemplate(): void {
    const templateData: IExcelTransaction[] = [
      {
        Дата: '2024-01-15',
        Тип: 'Доход',
        Категория: 'Зарплата',
        Подкатегория: 'Основная',
        Сумма: 100000,
        Описание: 'Зарплата за январь'
      },
      {
        Дата: '2024-01-16',
        Тип: 'Расход',
        Категория: 'Еда',
        Подкатегория: 'Продукты',
        Сумма: -5000,
        Описание: 'Покупка продуктов'
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Транзакции');
    
    XLSX.writeFile(workbook, 'шаблон_транзакций.xlsx');
  }
}