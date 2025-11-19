import { EntitySchema } from "typeorm";

export default new EntitySchema({
  name: "Links",
  tableName: "links",
  columns: {
    id: {
      type: "integer",
      primary: true,
      generated: true,
    },
    link_text: {
      type: "text",
      nullable: false,
    },
    link_url: {
      type: "text",
      nullable: false,
      unique: true,
    },
    linktree_id: {
      type: "integer",
      nullable: false,
    },
  },
});
