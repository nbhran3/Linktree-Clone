import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm";

export class CreateUserTable1765991477946 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "users",
        columns: [
          new TableColumn({
            name: "id",
            type: "integer",
            isGenerated: true,
            isPrimary: true,
            isNullable: false,
          }),
          new TableColumn({
            name: "email",
            type: "text",
            isGenerated: false,
            isPrimary: false,
            isNullable: false,
          }),
          new TableColumn({
            name: "password_hash",
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
    await queryRunner.dropTable("users");
  }
}
