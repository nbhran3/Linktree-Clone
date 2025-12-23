// TypeORM entity representing the "linktrees" table in the management database.
// One row = one linktree owned by a user.

import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "linktrees" })
export class Linktree {
  // Auto-incrementing primary key (linktree id)
  @PrimaryGeneratedColumn()
  id!: number;

  // Foreign key pointing to the user that owns this linktree
  @Column({ type: "integer" })
  user_id!: number;

  // Public suffix (e.g. "my-links") used in public URLs. Must be unique.
  @Column({ type: "text", unique: true })
  linktree_suffix!: string;
}

