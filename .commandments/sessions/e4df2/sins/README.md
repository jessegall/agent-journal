# Judge checklists

`sins.md` is the live worklist from the last `commandments judge` run: one line per sin,
grouped under the skill that fixes it. Work it top to bottom, deleting each line as you
fix its sin, and re-run judge only when the file is empty.

`sins-<date>_<time>.md` are the runs before it. **They are kept deliberately** — each one
is the record of what was true when it ran, and `commandments judge --repent=<date>_<time>`
scopes a re-run or a `repent` to exactly what that run reported. Nothing here leaked: the
newest five are kept and older ones are rotated out on their own.

The whole folder is generated and gitignored. Deleting it is safe — the next judge run
writes it again.