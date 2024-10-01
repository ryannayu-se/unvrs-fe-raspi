import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check localStorage for authentication token
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      router.push('/login'); // Redirect to login page if not authenticated
    }
  }, [router]);

  return isAuthenticated;
}
