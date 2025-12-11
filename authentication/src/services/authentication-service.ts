import * as UserRepository from '../repositories/user-repository';

export const getUserByEmail = (email: string) => {
    return UserRepository.getUserByEmail(email);
}

export const createUser = (email: string, passwordHash: string) => {
    return UserRepository.createUser(email, passwordHash);
}
