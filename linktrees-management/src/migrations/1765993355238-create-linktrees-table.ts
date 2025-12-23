import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm";

export class CreateLinktreesTable1765993355238 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "linktrees",
        columns: [
          new TableColumn({
            name: "id",
            type: "integer",
            isGenerated: true,
            isPrimary: true,
            isNullable: false,
          }),
          new TableColumn({
            name: "user_id",
            type: "integer",
            isGenerated: false,
            isPrimary: false,
            isNullable: false,
          }),
          new TableColumn({
            name: "linktree_suffix",
            type: "text",
            isGenerated: false,
            isPrimary: false,
            isNullable: false,
          }),
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("linktrees");
  }
}
