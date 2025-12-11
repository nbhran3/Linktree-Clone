import AppDataSource from "../data-source";
import {User} from "../entity/user";

const userRepository = AppDataSource.getRepository(User);

export const getUserByEmail = async (email: string) => {
  const user = await userRepository.findOne({
    where: { email: email },
  });

  return user;
}

export const createUser = async (email: string, passwordHash: string) => {
  const newUser = userRepository.create({
    email: email,
    password_hash: passwordHash,
  });
  const savedUser = await userRepository.save(newUser);
 
  return savedUser;
}