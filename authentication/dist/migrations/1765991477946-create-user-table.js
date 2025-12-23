"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserTable1765991477946 = void 0;
const typeorm_1 = require("typeorm");
class CreateUserTable1765991477946 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: "users",
            columns: [
                new typeorm_1.TableColumn({
                    name: "id",
                    type: "integer",
                    isGenerated: true,
                    isPrimary: true,
                    isNullable: false,
                }),
                new typeorm_1.TableColumn({
                    name: "email",
                    type: "text",
                    isGenerated: false,
                    isPrimary: false,
                    isNullable: false,
                }),
                new typeorm_1.TableColumn({
                    name: "password_hash",
                    type: "text",
                    isGenerated: false,
                    isPrimary: false,
                    isNullable: false,
                }),
            ],
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropTable("users");
    }
}
exports.CreateUserTable1765991477946 = CreateUserTable1765991477946;
//# sourceMappingURL=1765991477946-create-user-table.js.map