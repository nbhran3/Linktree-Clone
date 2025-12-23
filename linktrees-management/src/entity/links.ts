// TypeORM entity representing the "links" table in the management database.
// Each row is a single link (e.g. one button on a linktree page).

import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "links" })
export class Links {
  // Auto-incrementing primary key (link id)
  @PrimaryGeneratedColumn()
  id!: number;

  // Display text for the link button
  @Column({ type: "text" })
  link_text!: string;

  // Target URL for the link (unique in this schema)
  @Column({ type: "text", unique: true })
  link_url!: string;

  // Foreign key: which linktree this link belongs to
  @Column({ type: "integer" })
  linktree_id!: number;
}

