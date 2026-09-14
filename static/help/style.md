# Coding style

The coding style is how code in this project should look: naming, structure, error handling, anything two people might write differently. Each subject is one rule.

## What a rule becomes

Every rule is written into its own skill, `style-<subject>`, in `.claude/skills`. CLAUDE.md and AGENTS.md list them, so an agent loads the right one before it writes or reviews code on that subject.

## Asking for a review

**Ask for a coding style review** sends the agent a message. The agent sends a subagent to read the code and find the places where the style differs, then asks you about each one as a question with the code examples side by side. You pick the one that is right, and your answer becomes a rule.

Say where to look if you like, such as a folder, a layer or a kind of code. Leave it empty to let the agent choose.

## What you can do

- **Answer** the open questions at the top of the page.
- **Edit** a rule's title, decision or when it applies.
- **Remove** a rule. Its skill is deleted too.

## How the agent uses the coding style

- **Adding a rule.** `journal style add <subject> "<title>" --decision="…" --when="…" --brief`, with the reasoning, examples and triggers on stdin.
- **Asking.** `journal questions add "<question>" --about="style"` (or `--about="style <subject>"` for one rule), with each style as an `--option` and its example as `--option-code`.
- **Keeping the skills current.** Every change rewrites the skills; `journal style sync` does it by hand.
