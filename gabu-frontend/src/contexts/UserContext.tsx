import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useState,
} from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import { getUser } from '../database/repositories/userRepository';
import type { User } from '../types';

type UserContextType = {
  user: User | null;
  loading: boolean;
  error: string | null;
  refreshUser: () => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

type UserProviderProps = {
  children: ReactNode;
};

export function UserProvider({ children }: UserProviderProps) {
  const db = useSQLiteContext();
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setUser(await getUser(db));
    } catch (cause) {
      console.error('Erro ao carregar usuário local:', cause);
      setUser(null);
      setError('Não foi possível carregar seu progresso local.');
    } finally {
      setLoading(false);
    }
  }, [db]);

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        error,
        refreshUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error(
      'useUser deve ser utilizado dentro de UserProvider'
    );
  }

  return context;
}