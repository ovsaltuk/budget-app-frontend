import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import AddTransactionForm from './AddTransactionForm';

interface IAddTransactionModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const AddTransactionModal: React.FC<IAddTransactionModalProps> = ({
  open,
  onClose,
  onSuccess
}) => {
  const handleSuccess = () => {
    if (onSuccess) {
      onSuccess();
    }
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle >
        Добавить транзакцию
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <AddTransactionForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
};

export default AddTransactionModal;