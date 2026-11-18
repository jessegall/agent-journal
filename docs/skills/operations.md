# Skill operations and recovery

## The host lifecycle

- At setup and after an update: `php artisan migrate`, then `php artisan skill:refresh` (composer's `setup` script runs
  both in that order). Before the migrations, `skill:refresh` says the skills tables do not exist yet and changes
  nothing.
- Scheduled: `skill:resume` every minute publishes committed publications that wait, including one a killed run left
  once its lease ran out; `skill:prune` daily removes unused staged folders and retires old publications.
- Every supervisor command runs as the journal's system actor; no request can name that actor.

## Reading where delivery stands

`php artisan skill:status` shows the newest generation (ready, failed with its reason, or retired) and each session's
newest publication: pending, preparing, delivered, failed or superseded, with its safe error. `--session <id>` adds one
row per skill: stored revision, generated digest, selected or the reason it is not, delivered generation, whether the
agent read it in this context, and whether its program needs a new session to load it. `--json` prints the same.

## Recovering

- **A failed generation.** A broken shipped skill fails the whole generation, naming owner and key; the previous ready
  generation stays in use. Fix the source, then run `skill:refresh`.
- **A failed publication.** `skill:status` shows the reason and the command `php artisan skill:retry <publication>`.
  Fix the cause (a full disk, a folder the journal did not create at the target), then retry: it publishes the same
  generation again. Once the session has a newer publication, a retry is refused; run `skill:refresh` instead.
- **A launch refused.** A grant whose set is not delivered is refused, so nothing spawns without its skills; retry or
  refresh, then launch again. A required skill outside the selection refuses the launch naming the skill: change the
  profile or the skill's condition.
- **A held session.** A session whose new set waits may read, including `skill:status`, but changes no file until the
  set is delivered; it is released by itself.
- **Prune conflicts.** `skill:prune` keeps a staged folder that holds a changed or added file and prints it. Look at the
  file, move it out if it matters, and run `skill:prune` again.
- **A failed update.** Run `skill:status`: a failed generation or publication shows as failed, never as delivered.
  Recover with `skill:refresh` and `skill:retry` as above.
