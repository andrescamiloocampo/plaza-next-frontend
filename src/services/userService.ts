import { fetcher } from './api';

// Note: The data types for these functions should be defined in a types file
// for better type safety, e.g., src/types/user.d.ts

export const createOwner = async (ownerData: any) => {
  return fetcher('/api/admin/create-owner', {
    method: 'POST',
    body: JSON.stringify(ownerData),
  });
};

export const createEmployee = async (employeeData: any) => {
    return fetcher('/api/owner/create-employee', {
        method: 'POST',
        body: JSON.stringify(employeeData),
    });
};

export const createClient = async (clientData: any) => {
  return fetcher('/api/register/client', {
    method: 'POST',
    body: JSON.stringify(clientData),
  });
};