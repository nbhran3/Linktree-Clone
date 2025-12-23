// TypeORM entity representing the "users" table in the authentication database.
// Each instance of this class maps to a row in the "users" table.

import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

// Map this class to the "users" table
@Entity({ name: "users" })
export class User {
  // Auto-incrementing primary key (id SERIAL / BIGSERIAL)
  @PrimaryGeneratedColumn()
  id!: number;

  // User email (unique in practice, enforced at the business logic level)
  @Column({ type: "varchar" })
  email!: string;

  // Hashed password (never store the plain text password)
  @Column({ type: "varchar" })
  password_hash!: string;
}