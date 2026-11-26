# Skill operations and recovery

## The host lifecycle

- At setup and after an update: `php artisan migrate`, then `php artisan skill:refresh` (composer's `setup` script runs
  both in that order). Before the migrations, `skill:refresh` says the skills tables do not exist yet and changes
  nothing.
- Every supervisor command runs as the journal's system actor; no request can name that actor.

## Reading what a session was handed

`php artisan skill:status` shows the newest generation (ready, failed with its reason, or retired) and, for each
session, the generation and the skill keys its start was handed. `--session <id>` adds one row per skill: stored
revision, generated digest, selected or the reason it is not, the generation the start handed it in, and whether it
changed since the start. `--json` prints the same.

## Recovering

- **A failed generation.** A broken shipped skill fails the whole generation, naming owner and key; the previous ready
  generation stays in use. Fix the source, then run `skill:refresh`.
- **A start refused.** A required skill outside the selection refuses the start naming the skill: change the profile or
  the skill's condition.
- **Skills that changed.** A running session keeps the skills its start was handed; the agent is told at its next
  boundary to start a new session to get the changed ones.
- **A failed update.** Run `skill:status`: a failed generation shows as failed, never as ready. Recover with
  `skill:refresh`.
