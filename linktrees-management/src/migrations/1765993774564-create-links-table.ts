import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm";

export class CreateLinksTable1765993774564 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "links",
        columns: [
          new TableColumn({
            name: "id",
            type: "integer",
            isGenerated: true,
            isPrimary: true,
            isNullable: false,
          }),
          new TableColumn({
            name: "link_text",
            type: "text",
            isGenerated: false,
            isPrimary: false,
            isNullable: false,
          }),
          new TableColumn({
            name: "link_url",
            type: "text",
            isGenerated: false,
            isPrimary: false,
            isNullable: false,
          }),
          new TableColumn({
            name: "linktree_id",
            type: "integer",
            isGenerated: false,
            isPrimary: false,
            isNullable: false,
          }),
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
