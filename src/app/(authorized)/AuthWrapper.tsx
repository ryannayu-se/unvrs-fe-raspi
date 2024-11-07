"use client";

import React, { ReactNode } from 'react';
import { useAuth } from "@/hooks/useAuth";

interface AuthWrapperProps {
    children: ReactNode; // Define the type for children
  }
  
  const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
    useAuth();
  
    return <>{children}</>;
  };
  
  export default AuthWrapper;