import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1765440777299 implements MigrationInterface {
  name = "InitSchema1765440777299";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "links" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "linktrees" CASCADE`);

    await queryRunner.query(`
      CREATE TABLE "linktrees" (
        "id" SERIAL PRIMARY KEY,
        "user_id" integer NOT NULL,
        "linktree_suffix" text NOT NULL UNIQUE
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "links" (
        "id" SERIAL PRIMARY KEY,
        "link_text" text NOT NULL,
        "link_url" text NOT NULL UNIQUE,
        "linktree_id" integer NOT NULL REFERENCES "linktrees"("id") ON DELETE CASCADE
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "links"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "linktrees"`);
  }
}
