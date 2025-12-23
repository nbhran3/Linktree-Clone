// Repository layer for the User entity.
// This is the only place that should talk directly to TypeORM for users.

import AppDataSource from "../data-source";
import { User } from "../entity/user";

// Get the TypeORM repository instance for the User entity
const userRepository = AppDataSource.getRepository(User);

// Find a single user by email (or return null if not found)
export const getUserByEmail = async (email: string) => {
  const user = await userRepository.findOne({
    where: { email: email },
  });

  return user;
};

// Create and save a new user in the database
export const createUser = async (email: string, passwordHash: string) => {
  // Create an in-memory User entity
  const newUser = userRepository.create({
    email: email,
    password_hash: passwordHash,
  });

  // Persist the new user to the database
  const savedUser = await userRepository.save(newUser);

  return savedUser;
};