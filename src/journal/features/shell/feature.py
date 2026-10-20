from journal.support.entry import Entry
from journal.features.feature import Feature
from journal.engine.nudge import Nudge
from journal.models.node_kind import NodeKind
from journal.support.option import Option
from journal.features.shell.commands.output_command import OutputCommand
from journal.features.shell.commands.reader_command import ReaderCommand
from journal.features.shell.commands.shell_command import ShellCommand
from journal.features.shell.listeners.read_narrowly import ReadNarrowly
from journal.features.shell.listeners.spot_hand_reads import SpotHandReads
from journal.features.shell.listeners.refuse_mixed_journal import RefuseMixedJournal
from journal.support.skill import Skill


class Shell(Feature):
    name = "shell"
    title = "Shell commands"
    help = "A chained command is run part by part, each recorded with its output and its duration; one that runs past thirty seconds, or ten while a message of yours waits, goes to the background and the agent is told when it ends."
    commands = (ShellCommand, OutputCommand, ReaderCommand)
    FOREGROUND = Option("shell.foreground", "Run a command in the foreground for", "Seconds a part of a command may run before the rest of the chain moves to the background", 30, unit="seconds")
    WHILE_WAITING = Option("shell.foreground_while_waiting", "In the foreground while a message waits", "The same limit while the user has an unread or unanswered message, so they are not kept waiting", 10, unit="seconds")
    SHOWN = Option("shell.shown_lines", "Show of an output or a file", "The first and last so many lines of a command's output or a file; a file longer than twice this is not read whole", 200, unit="lines")
    READ_SHOWN = Option("shell.read_characters", "Show of a command that reads", "The characters of a reading command's output shown, half from each end, such as cat, grep or git diff; past it the agent reads the rest by the output's number", 8000, unit="characters")
    COMMAND_SHOWN = Option("shell.command_characters", "Show any other command's output up to", "Any other command's output, such as a test run or a build, is shown whole up to this; past it only a line naming the output, which the agent reads by its number", 200, unit="characters")
    KEPT = Option("shell.outputs_kept", "Keep the outputs of the last", "Command outputs kept as numbered rows with their files; past this the oldest go", 250, unit="commands")
    options = (FOREGROUND, WHILE_WAITING, SHOWN, READ_SHOWN, COMMAND_SHOWN, KEPT)
    listeners = (RefuseMixedJournal, ReadNarrowly, SpotHandReads)
    checks = (
        Entry(NodeKind.CHECK, 'journal_command', 'Tool is a journal command?', 'the tool about to run is a journal command'),
        Entry(NodeKind.CHECK, 'background_running', 'N or more commands running in the background?', "at least N of the agent's commands run in the background now; the text is N", takes_text=True),
    )

    MOVED = Nudge(name, "moved", "moved to the background as output {{n}}", "you are told when it ends. Carry on with what does not wait on it", repeat_after=0)
    ENDED = Nudge(name, "ended", "output {{n}} {{outcome}}", "`journal output read {{n}} --summary` says how; --tail 20 or --grep reads the part you need", repeat_after=0)
    USE_READER = Nudge(name, "use_reader", "reader {{reader}} already reads this: {{about}}", "`journal output read N --reader {{reader}}`", repeat_after=0)
    READER_TIP = Nudge(name, "reader_tip", "you read outputs this way again: {{command}}", "a reader does it for you: `journal reader add <name> --pattern <regex> --about \"<what it picks>\"`, then `journal output read N --reader <name>`", repeat_after=0)
    NARROW = Nudge(name, "narrow", "the file has {{lines}} lines, more than the {{cap}} shown at each end of a command's output", "read it in parts, with offset and limit, or grep for the line you need: everything a tool returns stays in the context for good", repeat_after=0)
    ALONE = Nudge(name, "alone", "a journal command runs on its own, or chained only with other journal commands", "chained with anything else it would move to the background with it; run it in a call of its own", repeat_after=0)
    CHECK_BACKGROUND = Nudge(name, "check_background", "output {{background_outputs}} still running", "look at it; hung or stuck: stop it and say why", repeat_after=300)
    nudges = (MOVED, ENDED, ALONE, CHECK_BACKGROUND)

    skill = Skill("shell", "How the journal runs your shell commands: in parts, timed, and in the background past the limit", """
# Shell commands

Every shell command you run goes through the journal's runner.

- A line chained with `&&` or `;` is run part by part; each part is recorded with what it printed and how long it took,
  and a failing part stops the chain where the shell would have.
- A command that runs past thirty seconds, or ten while a message of the user's waits, is moved to the background with
  the rest of its chain: the tool call returns with its output number, and you are told when output N ends.
- Every command's output is kept as a numbered output, the newest 250 of them. `journal output read N` needs a flag
  naming the part: `--tail 20`, `--head 20`, `--grep "<words>"`, `--lines 100-160`, `--reader <name>`, `--summary` for
  how it ended with its first and last lines, or `--all` for every line when you truly need it whole. `journal output
  list` names the newest. Read an output this way, never by running the command again nor by reading its files raw.
- A reader reads outputs of one shape, such as a test run's failures: `journal reader add <name> --pattern <regex>
  --about "<what it picks>"`, or `--script <file>` for a shell script handed the output on its input. Use it with
  `journal output read N --reader <name>`; `journal reader list` names the project's readers. The second time you
  read the same shape of output by hand, add a reader for it and say so in the chat.
- A test run, a build or any other command's output is shown whole up to 200 characters; past that you see only a
  line naming the output to read by its number. A command that reads (cat, grep, sed, git diff) is shown up to 8,000
  characters, past that by its two ends. A line of journal commands is shown whole and kept as no output.
- A command that only reads the project's own code runs as written, pipes and all: `grep -n x src/app.py | tail -5`
  answers at once. Any other command's trailing `| tail` is dropped, since its whole output is kept.
- A test suite is a long runner: run it on its own and chain the commit behind its result in a second call.
- A journal command runs on its own, or chained only with other journal commands; chained with anything else it is
  refused, since it would move to the background with the rest and its answer lost.
""", keywords=("background", "long-running"))
