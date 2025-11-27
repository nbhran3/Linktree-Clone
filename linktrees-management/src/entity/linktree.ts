import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "linktrees" })
export class Linktree {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "integer" })
  user_id!: number;

  @Column({ type: "text", unique: true })
  linktree_suffix!: string;
}

