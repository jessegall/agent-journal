# Skills

Skills are Core (`app/Skills`, namespace `App\Skills`), beside profiles (`app/Profiles`). A skill is a Markdown text an
agent reads before work it covers. Its source is PHP in its owner or a revision stored in the database; the files a
program reads are a projection of those sources, written by the journal.

## Declaring a skill in a domain or module

- The owner's domain class implements `App\Skills\Contracts\ProvidesSkills` and lists its skill classes in `skills()`.
  Core lists its own in `App\Skills\Support\CoreSkills`.
- A skill class implements `App\Skills\Contracts\Skill`: its key, name, description, condition and
  `sections(): SkillSections`. Keys are lowercase words joined by hyphens; `journal-*` is reserved for Core and the
  shipped domains, a registered module uses its own slug as prefix, and `user-*` is for stored skills.
- A shipped skill names its file: `SkillSections::fromFile('core/shell.md')`, a file in the owner's `resources/skills`
  folder. The file's `#` title must equal the skill's `name()`. The text between the title and the first `##` becomes
  the Purpose section; each `##` heading becomes one section, in file order, with the heading as written for its title,
  the heading in kebab case (`Str::slug`) for its key, and everything under it, `###` subheadings included, for its
  body. A heading added to the file is published without a code change.
- A module may still list its sections by hand: `SkillSections::listed(...)` of `SkillSection::text(key, heading,
  markdown)` or `SkillSection::markdown(key, heading, MarkdownPart)`. `MarkdownPart::body(file)` includes a whole file
  and `MarkdownPart::heading(file, [path])` one heading's subtree, both from the owner's `resources/skills` folder.
  Includes are checked: no absolute path, no `..`, no link leaving the folder, no repeated or missing heading.
- A broken file stops the catalogue with a refusal that names the file and the heading, as
  `App\Skills\Exceptions\SkillSourceInvalid`: `missingFile`, `outsideFolder` and `unreadable` for the file itself,
  `missingTitle` (no `#` title before the first `##`, or text before it), `secondTitle`, `titleDiffers` (the title is
  not the skill's name) and `headingWithoutKey` (a `##` heading with only punctuation). The renderer also refuses a key
  used twice (`SkillDeclarationInvalid::sectionKeyTwice`, for example two `## States`) and no sections or more than 64
  (`SkillDeclarationInvalid::sectionCount`).
- Two owners declaring one key stop the catalogue with both names; there is no winner by order.

## Who a skill reaches

A skill's condition is a tree of `App\Skills\Conditions\Conditions`: `everyone()`, `mainAgent()`, `profiles(...)`,
`agentTypes(...)`, `programs(...)`, `providers(...)`, `environments(...)`, `named(key, parameters)` and the groups
`all`, `any` and `not`. A result is match, no match or unavailable; unavailable never becomes a match. A domain adds
named conditions through `ProvidesSkillConditions`, each evaluator reading only its own facts; a write inside an
evaluation is refused. A profile's skill allowlist narrows the selection (absent keeps all, empty keeps none), and its
required skills must be selected or the launch is refused naming the skill.

`skill:preview <key>` shows who a skill reaches and why; `--agent` shows one agent's whole selection.

## Authoring stored skills

Users write skills through the bus: `skill:make`, `skill:edit` (with the revision you read), `skill:restore`,
`skill:retire`, `skill:copy` (a snapshot of a shipped or stored skill) and the reads `skill:list`, `skill:show`,
`skill:revisions` and `skill:revision`. The same operations are MCP tools (`skills_*`). Agents may read but not write
skills. Every write is a new revision; a retry with the same request id returns the same result.

## Generated files and who owns them

- `skill:refresh` checks and renders the whole catalogue as one immutable generation (reused when nothing changed) and
  records a pending publication for each running session whose selection changed.
- Staged sets live in the journal container under `storage/app/skills/generations/<generation>/<publication>/`, a
  checked copy with a `manifest.json` of identities and hashes. The journal owns them; `skill:prune` removes only files
  it staged whose bytes still match, never by a name prefix.
- The programs run on the host, so the launch grant carries the delivered files and the host writes them into the
  runtime's own settings folder before it spawns the program: `journal-skills/` passed with `--plugin-dir` for Claude
  Code, `skills/` inside the isolated `CODEX_HOME` for Codex. Nothing is written into an account folder or a checkout.
- A session reads its skills as receipts: a whole read proven by a tool call, counted per context; a file existing never
  counts as read.

## More

- [Operations and recovery](operations.md)
- [Skill delivery per program](program-support.md)
- [Read budgets](performance.md)
