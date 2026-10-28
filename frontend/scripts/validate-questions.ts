import fs from "node:fs";
import path from "node:path";
import { QuestionsArraySchema } from "../src/lib/schema";

const filePath = path.resolve(__dirname, "../src/content/questions.json");

function validateQuestions() {
  console.log(`Validating questions file: ${filePath}`);

  if (!fs.existsSync(filePath)) {
    console.error(`Error: ${filePath} does not exist.`);
    process.exit(1);
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch (err) {
    console.error("Error: Failed to parse JSON in questions.json:", err);
    process.exit(1);
  }

  const result = QuestionsArraySchema.safeParse(json);
  if (!result.success) {
    console.error("\n❌ Question validation failed with the following errors:\n");
    for (const issue of result.error.issues) {
      console.error(`- [${issue.path.join(".")}] ${issue.message}`);
    }
    process.exit(1);
  }

  const questions = result.data;
  const activeQuestions = questions.filter((q) => q.active);
  const levels = ["easy", "medium", "hard"] as const;

  console.log(`\n✅ Validated ${questions.length} total questions (${activeQuestions.length} active).`);

  for (const lvl of levels) {
    const count = activeQuestions.filter((q) => q.level === lvl).length;
    console.log(`  - Level ${lvl}: ${count} active questions`);
    if (count < 10) {
      console.warn(
        `    ⚠️ Warning: Level "${lvl}" has fewer than 10 active questions (${count}). Consider adding more questions to maintain deck balance.`
      );
    }
  }

  console.log("\nAll questions conform to the schema specifications.\n");
}

validateQuestions();

