// Zod schema for validating the public linktree suffix path param.

import { z } from "zod";

// :linktreeSuffix in /linktrees/:linktreeSuffix
export const suffixSchema = z.string().min(1);

export type Suffix = z.infer<typeof suffixSchema>;
