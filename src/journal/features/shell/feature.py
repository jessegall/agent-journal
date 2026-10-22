from journal.support.foreground_option import FOREGROUND_OPTION
from journal.features.feature import Feature
from journal.features.shell.listeners.output_notice import OutputNotice
from journal.features.shell.listeners.watch_update import WatchUpdate
from journal.features.shell.shell_conduct import ShellConduct
from journal.features.shell.support.shell_data_reader import ShellDataReader
from journal.features.shell.support.shell_data import ShellData
from journal.engine.nudge import Nudge
from journal.support.option import Option
from journal.features.shell.commands.output_command import OutputCommand
from journal.features.shell.commands.reader_command import ReaderCommand
from journal.support.skill import Skill
from journal.features.shell.seeds.cut_off_outputs import CutOffOutputs
from journal.features.shell.jobs.watch_refresh import WatchRefresh
from journal.features.shell.seeds.default_readers import DefaultReaders


class Shell(Feature[ShellData]):
    FOREGROUND = FOREGROUND_OPTION
    MESSAGE_FOREGROUND_LIMIT = Option("shell.foreground_while_waiting", "In the foreground while a message waits", "The same limit while the user has an unread or unanswered message, so they are not kept waiting", 10, unit="seconds")
    SHOWN = Option("shell.shown_lines", "Show of an output or a file", "The first and last so many lines of a command's output or a file; a file longer than twice this is not read whole", 200, unit="lines")
    READ_SHOWN = Option("shell.read_characters", "Show of a command that reads", "The characters of a reading command's output shown, half from each end, such as cat, grep or git diff; past it the agent reads the rest by the output's number", 8000, unit="characters")
    COMMAND_SHOWN = Option("shell.command_characters", "Show any other command's output up to", "Any other command's output, such as a test run or a build, is shown whole up to this; past it only a line naming the output, which the agent reads by its number", 400, unit="characters")
    SHORT = Option("shell.short_output", "Keep no output under", "A command whose whole output is under this many characters, with no pipe in its line, is shown as it is and kept as no numbered output; a longer one, or a line with a pipe into head, tail, grep or any filter, is kept", 400, unit="characters")
    UNREAD_OUTPUT_INTERVAL = Option("shell.unread_output_every", "Name an unread output again after", "Tool uses after the agent was told a background command ended, while it has not read its output, before it is told again; an idle agent is told again after the seconds a command runs in the foreground", 5, unit="tool uses")
    OUTPUT_DOCK = Option("shell.dock_live_outputs", "Dock live outputs", "A watched command's card is docked above the chat as soon as it runs, and taken down once it ends; a card you dock by hand stays until you close it", True, kind="switch")
    OUTPUT_COUNT = Option("shell.outputs_kept", "Keep the outputs of the last", "Command outputs kept as numbered rows with their files; past this the oldest go", 250, unit="commands")
    name = "shell"
    title = "Shell commands"
    help = "A chained command is run part by part, each recorded with its output and its duration; one that runs past thirty seconds, or ten while a message of yours waits, goes to the background and the agent is told when it ends."
    commands = (OutputCommand, ReaderCommand)
    options = (FOREGROUND, MESSAGE_FOREGROUND_LIMIT, SHOWN, READ_SHOWN, COMMAND_SHOWN, SHORT, UNREAD_OUTPUT_INTERVAL, OUTPUT_DOCK, OUTPUT_COUNT)
    listeners = (OutputNotice, WatchUpdate)
    seeds = (CutOffOutputs, DefaultReaders)
    jobs = (WatchRefresh,)
    data = (ShellDataReader,)
    conduct = (ShellConduct,)

    BACKGROUND_MOVE = Nudge(name, "moved_to_the_background", "moved to the background as output {{n}}", "carry on with what does not wait on it", repeat_interval=0)
    OUTPUTS_ENDED = Nudge(name, "outputs_ended", "{{outputs}}", "`journal output read {{n}} --summary` says how", repeat_interval=0)
    READER_HINT = Nudge(name, "use_the_reader", "reader {{reader}} already reads this: {{about}}", "`journal output read N --reader {{reader}}`", repeat_interval=0)
    READER_SUGGESTION = Nudge(name, "add_a_reader", "you read outputs this way again: {{command}}", "a reader does it for you: `journal reader add <name> --pattern <regex> --about \"<what it picks>\"`, then `journal output read N --reader <name>`", repeat_interval=0)
    PARTIAL_FILE_READ = Nudge(name, "read_the_file_in_parts", "the file has {{lines}} lines, more than the {{cap}} shown at each end of a command's output", "read it in parts, with offset and limit, or grep for the line you need: everything a tool returns stays in the context for good", repeat_interval=0)
    JOURNAL_COMMAND_ISOLATION = Nudge(name, "journal_command_runs_alone", "a journal command runs on its own, or chained only with other journal commands", "chained with anything else it would move to the background with it; run it in a call of its own", repeat_interval=0)
    BACKGROUND_CHECK = Nudge(name, "check_the_background", "output {{background_outputs}} still running", "look at it; hung or stuck: stop it and say why", repeat_interval=300, blocks_regardless=True)
    WATCH_VIEW = Nudge(name, "watched_output", "output {{n}}, which you watch:\n{{lines}}", repeat_interval=0)
    UNREAD_OUTPUT = Nudge(name, "unread_output", "{{outputs}}, and you have not read it yet", repeat_interval=0)
    WATCH_ENDED = Nudge(name, "watched_output_ended", "output {{n}}, which you watched, {{ending}}:\n{{lines}}", "the watch has ended", repeat_interval=0)
    WATCH_SUGGESTION = Nudge(name, "watch_it_live", "watch it live, so the user sees it move: `journal output watch {{n}}{{reader}} --title \"<what it is doing, such as Running tests>\"`", "or `journal await \"<what>\" --output {{n}}{{reader}}` when you wait on it", repeat_interval=0)
    NEW_READER_SUGGESTION = Nudge(name, "make_its_reader", "no reader reads {{command}} yet: make one, and its card shows how far it is", "`journal reader add <name> --commands \"{{command}}\" --pattern '<its failure and summary lines>' --progress '<a percent or a count of a total, in groups>' --label 'Running tests'`, then watch it with --reader <name>; the next run is told of it by itself", repeat_interval=0)
    READER_FIX = Nudge(name, "fix_the_reader", "the reader {{reader}} put a line on output {{n}}'s card that reads as code or data, or is too long for the card, for the user: {{line}}", "tighten its pattern to short lines a person reads as how the run goes, such as its summary: `journal reader add {{reader}} --pattern '<those lines>' ...` writes it anew", repeat_interval=0)
    READER_DETAIL = Nudge(name, "give_the_reader_its_summary", "output {{n}}'s card showed the user only its title: the reader {{reader}} picked no line and no progress", "give it a pattern for the run's summary line and a --progress pattern with a --label, so the card reads like Running tests 40% and ends on 567 passed: `journal reader add {{reader}} --pattern '<failures and summary>' --progress '<percent or count>' --label '<what the run is doing, such as Running tests>'`", repeat_interval=0)
    READER_TOPIC = Nudge(name, "give_the_reader_a_topic", "{{command}} has run here with {{count}} different arguments, so its card's title should say what each run is about", "give the reader {{reader}} a topic pattern read over the command line, such as the files or the -k it names: `journal reader add {{reader}} ... --topic '<pattern>'`", repeat_interval=0)
    READER_WATCH = Nudge(name, "watched_reader_output", "output {{n}}, a run of {{command}}, went to the background at once and is watched through the reader {{reader}}", repeat_interval=0)
    ALIAS_WATCH = Nudge(name, "watched_alias_output", "output {{n}}, the run of journal {{name}}, is watched{{reader}}", repeat_interval=0)
    ALIAS_HINT = Nudge(name, "use_the_alias", "journal {{name}} runs this line: {{line}}", "run `journal {{name}} [args]` next time: it passes the args on and watches a long run through its reader", repeat_interval=0)
    ALIAS_SUGGESTION = Nudge(name, "add_an_alias", "you ran {{shape}} three times or more", "make it an alias, `journal alias add <name> \"<the line without the values that change>\"{{reader}}`, and run `journal <name> <those values>` from then on", repeat_interval=0)
    nudges = (READER_FIX, READER_DETAIL, READER_TOPIC, READER_WATCH, ALIAS_WATCH, ALIAS_HINT, ALIAS_SUGGESTION, WATCH_VIEW, WATCH_ENDED, WATCH_SUGGESTION, NEW_READER_SUGGESTION, BACKGROUND_MOVE, OUTPUTS_ENDED, UNREAD_OUTPUT, JOURNAL_COMMAND_ISOLATION, BACKGROUND_CHECK, READER_HINT, READER_SUGGESTION, PARTIAL_FILE_READ)

    skill = Skill("shell", "How the journal runs your shell commands: in parts, timed, and in the background past the limit", """
# Shell commands

Every shell command you run goes through the journal's runner.

- A line chained with `&&` or `;` is run part by part; each part is recorded with what it printed and how long it took,
  and a failing part stops the chain where the shell would have.
- A command that runs past thirty seconds, or ten while a message of the user's waits, is moved to the background with
  the rest of its chain: the tool call returns with its output number, and you are told when output N ends. Until you
  read it, by `journal output read N` or `status N`, it is named again every five tool uses, or after thirty idle seconds.
- A command whose whole output is under 400 characters, with no pipe in its line, prints as it is and is kept as no
  output. Any other command's output is kept as a numbered output, the newest 250 of them. `journal output read N` needs a flag
  naming the part: `--tail 20`, `--head 20`, `--grep "<words>"`, `--lines 100-160`, `--reader <name>`, `--summary` for
  how it ended with its first and last lines, or `--all` for every line when you truly need it whole. `journal output
  list` names the newest. `journal output status N` says in one line whether it is running, finished or failed with code C;
  without a number it names each of your background outputs with its status. Read an output this way, never by running the command again nor by reading its files raw.
- A reader reads outputs of one shape, such as a test run's failures: `journal reader add <name> --pattern <regex>
  --about "<what it picks>"`, or `--script <file>` for a shell script handed the output on its input. Use it with
  `journal output read N --reader <name>`; `journal reader list` names the project's readers. The second time you
  read the same shape of output by hand, add a reader for it and say so in the chat.
- `journal output watch N [--reader <name>] [--title "<words>"]` binds a running output to you: after every tool use you are
  shown the lines its reader picks, or its last ten lines with no reader, and a card in the chat shows the same, updated in
  place. The card is for the user: its title says what the run is doing in plain words, `--title "Running tests"`, else
  the reader's label, else what the command does; the command line shows only when the user opens the card. The
  watch ends by itself when the command ends, and you are told once how it ended; `journal output unwatch` ends it
  sooner. One output is watched at a time. A reader written for a watch picks few lines that read well in the card, and
  may show how far the command has come: `--progress <regex>` takes the last match, its groups a percentage such as
  `\\[(\\d+)%\\]` or a count of a total such as `(\\d+)/(\\d+)`, drawn as a bar in the card, and `--label "<words>"` says what the run is doing, such as Running tests or Building the
  application, never a bare name such as Tests; `--topic '<pattern>'`, read over the command line, adds what a run is about
  after the title, such as the test files or the -k a line names, for a command run with different arguments.
- A reader names the commands whose output it reads, `--commands "pytest"`, and a command moved to the background that
  runs one is told to watch it with that reader, so one reader serves every later run; a test run or a build no reader
  reads is told to make one first, with the line to copy. The journal ships readers for pytest, dotnet test and phpunit
  or pest in .journal/readers as examples. Waiting on a command, `journal await "<what>" --output N --reader <name>`
  watches it too, so the user sees it move while you wait.
- A test run, a build or any other command's output is shown whole up to 400 characters; past that you see only a
  line naming the output to read by its number, with its lines, its characters and the part of the line it came from. A command that reads (cat, grep, sed, git diff) is shown up to 8,000
  characters, past that by its two ends. A line of journal commands is shown whole and kept as no output.
- A command that only reads or edits the project's own code, a file, a folder or a glob under the project and outside .journal, runs as written, pipes and all,
  in the shell itself: nothing of it is captured, recorded or kept, and `grep -n x src/app.py | tail -5` answers at once. Any other command's trailing `| tail` or `| head` is taken off the line: the command runs whole, the
  whole output is kept under its number, and your cut is applied to it and shown before the one line naming the
  number, so the lines you asked for come back and the rest stays readable.
- An alias names a command line of the project: `journal alias add <name> "<line>" [--reader <name>] [--about "<what
  it does>"] [--env KEY=VALUE]`, then `journal <name> [args]` runs the line with the args at its end, recorded as your
  own command. A run that moves to the background is watched at once through the alias's reader, so the user sees it
  move. `journal alias list` names them, `journal alias edit <name> [--line] [--reader] [--about]` changes one and
  `journal alias remove <name>` takes it away; a name that is a journal command or an alias already is refused. The
  user types the same `journal <name>` in a terminal, and a plugin may ship aliases with their readers. An alias chains
  with other commands like any command. A line an alias runs, typed by hand, is pointed at the alias; a line you run
  three times or more with no alias for it is asked once to become one, with the reader that reads it.
- A test suite is a long runner: run it on its own and chain the commit behind its result in a second call.
- A journal command runs on its own, or chained only with other journal commands; chained with anything else it is
  refused, since it would move to the background with the rest and its answer lost.
""", keywords=("background", "long-running", "alias"))
