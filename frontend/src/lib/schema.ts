import { z } from "zod";

export const QuestionLevelSchema = z.enum(["easy", "medium", "hard"]);
export type QuestionLevel = z.infer<typeof QuestionLevelSchema>;

export const QuestionTypeSchema = z.enum(["open", "multiple_choice"]);
export type QuestionType = z.infer<typeof QuestionTypeSchema>;

export const QuestionSchema = z
  .object({
    id: z
      .string()
      .regex(
        /^(easy|medium|hard)-\d{3}$/,
        "ID must follow format {level}-{3 digits}, e.g. easy-001"
      ),
    level: QuestionLevelSchema,
    type: QuestionTypeSchema,
    question: z.string().trim().min(1, "Question cannot be empty"),
    options: z.array(z.string().trim().min(1)).min(2).max(4).nullable(),
    answer: z.string().trim().min(1, "Answer cannot be empty"),
    note: z.string().trim().min(1).nullable(),
    active: z.boolean(),
  })
  .strict()
  .superRefine((data, ctx) => {
    // ID prefix must match level
    if (!data.id.startsWith(`${data.level}-`)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `ID prefix "${data.id.split("-")[0]}" does not match level "${data.level}"`,
        path: ["id"],
      });
    }

    if (data.type === "multiple_choice") {
      if (!data.options || data.options.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "multiple_choice questions must provide between 2 and 4 options",
          path: ["options"],
        });
      } else if (!data.options.includes(data.answer)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Answer "${data.answer}" must exactly match one of the options`,
          path: ["answer"],
        });
      }
    } else if (data.type === "open") {
      if (data.options !== null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Open questions must have options set to null",
          path: ["options"],
        });
      }
    }
  });

export type Question = z.infer<typeof QuestionSchema>;

export const QuestionsArraySchema = z.array(QuestionSchema).superRefine((questions, ctx) => {
  const seenIds = new Set<string>();
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    if (seenIds.has(q.id)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Duplicate question ID found: "${q.id}"`,
        path: [i, "id"],
      });
    }
    seenIds.add(q.id);
  }
});

