import { atom, useAtom } from 'jotai';

export type User = {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    isVerified: boolean;
    role: 'admin' | 'user';
}

const userAtom = atom<User | null>(null);
const userLoadedAtom = atom(false);

export const useUser = () => useAtom(userAtom);
export const userUserLoaded = () => useAtom(userLoadedAtom);