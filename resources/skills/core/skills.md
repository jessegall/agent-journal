# Skills

## What a skill is

A skill is a set of instructions the journal hands to an agent. Core, each domain and each installed module supply their own skills as PHP classes; each skill has a stable key, a name, a description, a condition that decides who receives it, and sections in a fixed order.

## Keys

A skill key is lowercase letters and digits in words joined by single hyphens, at most 64 characters. Keys starting with `journal-` belong to the journal's own skills, keys starting with `user-` to skills users write, and a module's keys start with its own name. Two skills never share a key.

## Reading skills

- `skill:list` lists every skill with its key, name, owner, source and the digest of its text.
- `skill:show <key>` prints a skill's text exactly as it is delivered. `--json` adds its owner, source and digest.

The digest changes exactly when the delivered text changes, so two equal digests mean the same text.

## When the catalogue cannot be built

When two skills declare one key, or a skill names Markdown that is missing or outside its owner's folder, `skill:list` prints that reason instead of a partial list. The owner named in the reason fixes its declaration.

## What a skill does not do

A skill only instructs. It grants no permission and runs nothing; the journal's access rules decide what an agent may do.
