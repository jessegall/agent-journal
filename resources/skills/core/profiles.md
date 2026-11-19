# Profiles

## What a profile is

A profile is a named way to start an agent: its type, model, instructions and skill lists. Each profile has a stable key, such as `journal-reviewer`: lowercase letters and digits in words joined by single hyphens, at most 64 characters. The key never changes; the label may.

## Types

A profile's type is the most authority its agent has in the workspace:

- `main_agent`: the main agent of an environment.
- `read_only_helper`: a helper that only reads.
- `writing_helper`: a helper that writes in its own worktree.

A profile's name never decides its permissions; its type does.

## Revisions

Every activation appends a new revision; earlier revisions stay readable and never change. A start keeps the revision it started with, so a change reaches only starts made after it. A retired profile keeps its key and revisions, but no new start can choose it.

## Skill lists

- The skill allowlist narrows the skills that apply to the agent. When it is absent, every applicable skill is offered; when it is empty, none is.
- Required skills must be among the skills selected for the start.

A profile never makes a skill apply that its own condition excludes.

## Reading profiles

- `profile:list` lists every profile by key, label and whether it is current or retired.
- `profile:show <key>` shows the current revision: type, model, skill allowlist, required skills and instructions. `--revision <number>` shows an earlier one.

An unknown key is refused as missing; a retired one as retired. Choose a current key from `profile:list`.
