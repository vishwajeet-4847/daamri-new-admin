/**
 * TOAST NOTIFICATION USAGE EXAMPLES
 * 
 * This file demonstrates how to use centralized error and success toast notifications
 * throughout your application.
 */

import { showErrorToast, showSuccessToast, showLoadingToast, updateToast, dismissToast } from '../lib/toastNotification';

// ============================================
// EXAMPLE 1: API Error Handling in React Query
// ============================================
// In services/api.ts - Update your mutation to show error toasts

/*
export const useCreateProperty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<Property>) => {
      const response = await apiClient.post<{ success: boolean; data: any }>('/api/admin/properties', data);
      return mapId(response.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      showSuccessToast('Property created successfully!');
    },
    onError: (error: any) => {
      const errorMessage = error.data?.message || error.message || 'Failed to create property';
      showErrorToast(errorMessage);
    },
  });
};
*/

// ============================================
// EXAMPLE 2: Form Submission with Error Toast
// ============================================
// In a component like PropertyForm.tsx

/*
const handleSubmit = async (formData: any) => {
  try {
    const response = await apiClient.post('/api/admin/properties', formData);
    showSuccessToast('Property created successfully!');
    // Navigate or refresh data
  } catch (error: any) {
    const errorMessage = error.data?.message || 'Failed to create property';
    showErrorToast(errorMessage);
  }
};
*/

// ============================================
// EXAMPLE 3: Loading Toast with Update
// ============================================

/*
const handleLongOperation = async () => {
  const toastId = showLoadingToast('Processing your request...');
  
  try {
    await performLongOperation();
    
    updateToast(toastId, {
      render: 'Operation completed successfully!',
      type: 'success',
      isLoading: false,
      autoClose: 4000,
    });
  } catch (error) {
    updateToast(toastId, {
      render: 'Operation failed. Please try again.',
      type: 'error',
      isLoading: false,
      autoClose: 4000,
    });
  }
};
*/

// ============================================
// EXAMPLE 4: Simple Success Toast
// ============================================

/*
const handleDelete = async (id: string) => {
  try {
    await apiClient.delete(`/api/admin/properties/${id}`);
    showSuccessToast('Property deleted successfully!');
    // Refresh data
  } catch (error: any) {
    showErrorToast(error.message || 'Failed to delete property');
  }
};
*/

// ============================================
// EXAMPLE 5: Custom Error Handling in API Response
// ============================================

/*
// In apiClient.ts - Enhanced error handling
try {
  const response = await fetch(`${BASE_URL}${endpoint}`, config);
  
  if (!response.ok) {
    const data = await response.json();
    showErrorToast(data.message || 'An error occurred');
    throw new ApiError(data.message, response.status, data);
  }
  
  return await response.json();
} catch (error) {
  if (!(error instanceof ApiError)) {
    showErrorToast('Network error. Please check your connection.');
  }
  throw error;
}
*/

// ============================================
// AVAILABLE TOAST FUNCTIONS
// ============================================

/*
showErrorToast(message: string, options?: ToastOptions)
- Shows an error toast notification
- Example: showErrorToast('Something went wrong!');

showSuccessToast(message: string, options?: ToastOptions)
- Shows a success toast notification
- Example: showSuccessToast('Property saved!');

showInfoToast(message: string, options?: ToastOptions)
- Shows an info toast notification
- Example: showInfoToast('New update available');

showWarningToast(message: string, options?: ToastOptions)
- Shows a warning toast notification
- Example: showWarningToast('This action cannot be undone');

showLoadingToast(message: string)
- Shows a loading toast that doesn't auto-close
- Returns a toast ID for updating later
- Example: const id = showLoadingToast('Loading...');

updateToast(toastId: string | number, options: ToastOptions)
- Updates an existing toast (useful for loading -> success/error transitions)
- Example: updateToast(id, { render: 'Done!', type: 'success' });

dismissToast(toastId?: string | number)
- Removes a specific toast or all toasts
- Example: dismissToast(id); or dismissToast();
*/

// ============================================
// TOAST OPTIONS (Optional Customization)
// ============================================

/*
You can customize any toast by passing options:

{
  position: 'top-center' | 'top-left' | 'top-right' | 'bottom-center' | 'bottom-left' | 'bottom-right',
  autoClose: 4000, // milliseconds or false to disable
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: 'dark' | 'light' | 'colored',
}

Example:
showErrorToast('Custom error', {
  autoClose: 6000,
  position: 'bottom-right',
});
*/
