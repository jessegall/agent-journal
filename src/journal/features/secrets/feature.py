from journal.features.feature import Feature
from journal.engine.nudge import Nudge
from journal.features.skill import Skill
from journal.features.secrets.commands.secret_command import SecretCommand
from journal.features.secrets.listeners.keep_out_of_private import KeepOutOfPrivate
from journal.features.secrets.listeners.alarm_on_leak import AlarmOnLeak
from journal.features.secrets.listeners.ask_when_expired import AskWhenExpired
from journal.features.secrets.listeners.purge_after_thirty_days import PurgeAfterThirtyDays
from journal.features.secrets.listeners.tell_allowed import TellAllowed
from journal.features.secrets.seeds.secret_files import SecretFiles


class Secrets(Feature):
    name = "secrets"
    title = "Secrets"
    help = "A key or a login the agent may use without seeing it: its values live in a file in your home folder, never in the journal, and you fill them in on the Secrets page."
    KEPT_OUT = Nudge(name, "kept_out", "the secrets and the MCP keys in the private folder are out of your reach", "a secret reaches a program through `journal secret run <n> -- <program>`; its value is never yours to read", repeat_after=0)
    ALLOWED = Nudge(name, "allowed", "the user let secret {{n}}, {{title}}, go to {{programs}}", "run it with `journal secret run {{n}} -- <program> ...`", repeat_after=0)
    nudges = (KEPT_OUT, ALLOWED)
    commands = (SecretCommand,)
    seeds = (SecretFiles,)
    skill = Skill("secrets", "Keys and logins the agent uses without seeing them; load it when a task needs a key, a login or a site you must be logged in to", """
# Secrets

A secret is a key or a login you may use without ever seeing it. Its values live in a file in the user's home folder,
outside the project, and never in the journal; the journal masks a value anywhere it would be written.

- A task needs a key you do not have: `journal secret request "<name>" --why "<what for>"`, with `--kind login` for a
  username and password. The user fills it on the Secrets page; never ask for a value in the chat.
- `journal secret list` names the secrets and what each waits for; `journal secret show <n>` shows its fields, which are
  filled and the programs it may go to.
- Use one with `journal secret run <n or name> -- <program> <args>`: the program gets the hidden value on its input,
  `--stdin "Authorization: Bearer {key}"` sends that text with the fields filled in, and `--env` gives the fields in their
  variables too. It runs in the journal's own process with a home of its own and nothing of your shell, and what it prints
  comes back with every form of the value masked.
- A secret goes only to the programs the user allowed, named bare, never to a shell, an interpreter, a build tool or a
  program that echoes what it is given. Propose one with `journal secret propose <n> <program>`; you are told when the user
  allows it. A worker gets a secret only when the user lets helpers have it.
- A site you use in a browser: `journal secret request "<site>" --kind "browser login" --url <address> --why "<what for>"`.
  The user logs in with the Log in button on the Secrets page, in a browser on their computer, and your browser starts
  logged in from its next start. Where the user lets you log in on your own, `journal secret login <n>` opens it, and
  `journal secret login <n> --wait` waits until it is done.
- The secrets folder and the MCP keys are out of your reach: a tool that names them is refused.
- Masking cannot catch a value inside another encoding, such as Basic auth, nor a file the program writes, nor its
  variables while it runs.
- A value you made yourself, such as a generated password, goes in with `journal secret store <n> <field> <file>`,
  which deletes the file.
- A deleted secret keeps its values thirty days for `journal secret restore <n>`, then they go.
""", keywords=("secret", "secrets", "api key", "token", "password", "login"))
    listeners = (AlarmOnLeak, KeepOutOfPrivate, TellAllowed, AskWhenExpired, PurgeAfterThirtyDays)
