export interface ApiErrorResponse {
  message: string;
}

export interface ApiResponseError {
  response?: {
    data?: ApiErrorResponse;
    status: number;
  };
  request?: XMLHttpRequest; // Более специфичный тип
  message: string;
  config?: {
    url?: string;
    method?: string;
  };
}

export interface IRegisterData {
  email: string;
  login: string;
  password: string;
}

// Type guard для проверки типа ошибки
export function isApiResponseError(error: unknown): error is ApiResponseError {
  return (
    typeof error === 'object' &&
    error !== null &&
    ('response' in error || 'request' in error || 'message' in error)
  );
}

// Утилита для извлечения сообщения об ошибке
export function getErrorMessage(error: unknown): string {
  if (isApiResponseError(error)) {
    return error.response?.data?.message || error.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'Произошла неизвестная ошибка';
}