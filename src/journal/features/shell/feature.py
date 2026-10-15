from journal.features.feature import Feature
from journal.features.nudge import Nudge
from journal.features.shell.commands.shell_command import ShellCommand
from journal.features.skill import Skill


class Shell(Feature):
    name = "shell"
    title = "Shell commands"
    help = "A chained command is run part by part, each recorded with its output and its duration; one that runs past thirty seconds, or ten while a message of yours waits, goes to the background and the agent is told when it ends."
    commands = (ShellCommand,)

    MOVED = Nudge(name, "moved", "moved to the background: {{part}}", "its output goes to {{file}}; you are told when it ends. Carry on with what does not wait on it", repeat_after=0)
    ENDED = Nudge(name, "ended", "the command in the background {{outcome}}", "last lines: {{last}}; the whole output is at {{file}}", repeat_after=0)
    nudges = (MOVED, ENDED)

    skill = Skill("shell", "How the journal runs your shell commands: in parts, timed, and in the background past the limit", """
# Shell commands

Every shell command you run goes through the journal's runner.

- A line chained with `&&` or `;` is run part by part; each part is recorded with what it printed and how long it took,
  and a failing part stops the chain where the shell would have.
- A command that runs past thirty seconds, or ten while a message of the user's waits, is moved to the background with
  the rest of its chain: the tool call returns at once with the file its output goes to, and you are told when it ends.
- A test suite is a long runner: run it on its own and chain the commit behind its result in a second call.
""", keywords=("background", "long-running"))
