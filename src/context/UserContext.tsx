'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { useUser as useUserAuth0 } from '@auth0/nextjs-auth0/client';

interface UserContextType {
  userData: any; // You can define a more specific type for user data
  setUserData: React.Dispatch<React.SetStateAction<any>>;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { user, isLoading: isAuthLoading } = useUserAuth0();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true); // Set loading to true while fetching
      if (user) {
        try {
          const res = await fetch(
            `/api/aws/dynamodb/users/getUserById?userId=${user.sub}`
          );
          const data = await res.json();
          setUserData(data);
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUserData(null); // Reset userData on error
        }
      } else {
        setUserData(null); // Reset userData if not authenticated
      }
      setLoading(false); // Finished loading
    };

    fetchUserData();
  }, [user]); // Re-fetch when auth state changes

  return (
    <UserContext.Provider
      value={{ userData, setUserData, loading: isAuthLoading || loading }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook for easy access to the User context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
