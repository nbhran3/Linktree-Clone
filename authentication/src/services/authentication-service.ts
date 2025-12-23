// Service layer for authentication.
// This file sits between the controller and the repository and is where
// you would normally put business logic that is not tied to HTTP or DB details.

import * as UserRepository from "../repositories/user-repository";

// Get a user by email using the repository (DB access layer)
export const getUserByEmail = (email: string) => {
  return UserRepository.getUserByEmail(email);
};

// Create a new user with the given email and hashed password
export const createUser = (email: string, passwordHash: string) => {
  return UserRepository.createUser(email, passwordHash);
};
