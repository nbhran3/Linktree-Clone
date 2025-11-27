import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "links" })
export class Links {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "text" })
  link_text!: string;

  @Column({ type: "text", unique: true })
  link_url!: string;

  @Column({ type: "integer" })
  linktree_id!: number;
}

