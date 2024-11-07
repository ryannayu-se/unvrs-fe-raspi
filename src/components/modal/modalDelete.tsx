import React, { useState, useEffect } from 'react';
import api from '@/config/apiConnection';

interface MessageProps {
  id: number
  message: string
  route: string
  onSubmitSuccess: () => void
}

const ModalDelete: React.FC<MessageProps> = ({id, message, route, onSubmitSuccess}) => {
  const handleDelete = async (event: React.FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
    try{
      const authToken = localStorage.getItem('authToken');
      const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};

      if(id){
        const response = await api.delete(`${route}/${id}`, { headers });
        console.log('Success delete ID: ',id);
        onSubmitSuccess();
      }
    }catch(error){
      console.error('Error deleting ID:', id, error);
    }
  }
  return (
      <div className="text-center">
        <p className="text-lg text-gray-700">{message}</p>
      <button
        type="button"
        className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-700"
        onClick={handleDelete}
      >
        Confirm
      </button>
      </div>
    );
  };
  
  export default ModalDelete;
  