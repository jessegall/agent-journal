---
name: journal-secrets
description: Use keys and logins without seeing them; read it when a task needs a key or a login
---

# Secrets

A secret is a key or a login you may use without ever seeing it. Its values are stored in a file in the user's home
folder, outside the project, and never in the journal.

- A task needs a key you do not have: `journal secret request "<name>" --why "<what for>"`. The user fills it on the
  Secrets page; never ask for a value in the chat.
- `journal secret make "<title>" --type <type> --brief "<how it is used>"` makes an empty one;
  `journal secret update <n>` changes it.
- `journal secret list` names the secrets and what each waits for; `journal secret show <n>` shows its fields, which
  are filled in and the programs it may go to.
- Use one with `journal secret run <n or name> -- <program> <args>`: the program receives the value on its input,
  `--stdin "Authorization: Bearer {key}"` sends that text with the fields filled in, and `--env` provides the fields in
  their variables too. What it prints comes back with the value masked.
- A secret goes only to the programs the user allowed. Propose one with `journal secret propose <n> <program>`.
- A value you made yourself, such as a generated password, goes in with `journal secret store <n> <field> <file>`,
  which deletes the file.
- `journal secret delete <n>` removes one and `journal secret restore <n>` brings it back.
- The secrets folder is out of your reach: a tool that names it is refused.
