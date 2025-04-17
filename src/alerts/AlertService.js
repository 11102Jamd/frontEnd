import Swal from 'sweetalert2';

export const showSuccessAlert = (title, text) => {
  return Swal.fire({
    title,
    text,
    icon: 'success',
    confirmButtonText: 'Aceptar'
  });
};

export const showErrorAlert = (title, text) => {
  return Swal.fire({
    title,
    text,
    icon: 'error',
    confirmButtonText: 'Aceptar'
  });
};

export const showWarningAlert = (title, text) => {
  return Swal.fire({
    title,
    text,
    icon: 'warning',
    confirmButtonText: 'Aceptar'
  });
};

export const showConfirmDialog = (title, text, confirmButtonText = 'Confirmar') => {
  return Swal.fire({
    title,
    text,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33'
  });
};