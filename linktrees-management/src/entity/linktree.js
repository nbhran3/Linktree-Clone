import { EntitySchema } from "typeorm";

export default new EntitySchema({
  name: "Linktree",
  tableName: "linktrees",
  columns: {
    id: {
      type: "integer",
      primary: true,
      generated: true,
    },
    user_id: {
      type: "integer",
      nullable: false,
    },
    linktree_suffix: {
      type: "text",
      nullable: false,
      unique: true,
    },
  },
});
