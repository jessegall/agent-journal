import re
from argparse import Namespace
from pathlib import Path

from journal.features.shell.support.output_views import OutputViews
from journal.repositories.command_outputs import CommandOutputs
from journal.features.shell.support.activity_title import ActivityTitle
from journal.console.command import WORKER_KINDS, Command
from journal.support.caller import Caller
from journal.features.shell.support.reader import Reader
from journal.features.shell.support.readers import Readers
from journal.features.shell.support.reader_commands import ReaderCommands
from journal.support.rejection import Rejection

NAME = re.compile(r"[a-z0-9][a-z0-9-]*")


class ReaderCommand(Command):
    """The project's output readers: add one for a shape of output read again and again, and list them."""

    noun = "reader"
    callers = {"list": WORKER_KINDS}

    def __init__(self, readers: Readers, outputs: CommandOutputs, views: OutputViews) -> None:
        self.readers, self.outputs, self.views = readers, outputs, views

    def arguments(self, verbs) -> None:
        addition = self.verb(verbs, "add", "a reader kept in .journal/readers/: the lines a pattern matches, or what a script handed the output prints; writing an existing one anew keeps each setting a flag leaves out, and an empty value takes one away")
        addition.add_argument("name")
        source = addition.add_mutually_exclusive_group(required=True)
        source.add_argument("--pattern")
        source.add_argument("--script", type=Path, help="a shell script given the output on its input")
        addition.add_argument("--about", help="what it picks, in a few words; a new reader needs it")
        addition.add_argument("--progress", help="a pattern whose last match says how far the command has come: one group for a percentage, two for a count of a total")
        addition.add_argument("--topic", help="a pattern read over the command line whose matches say what a run is about, after the card's title: the test files a line names, or its -k, such as '(\\S+\\.py)'")
        addition.add_argument("--label", help="what the run is doing, the card's title and the words before its progress, such as Running tests")
        addition.add_argument("--step", help="a pattern for one step, such as a test's dot, that moves the progress between two of its counts")
        addition.add_argument("--finished", help="a pattern for the lines it picks once the command finished, such as its summary; the pattern picks them while it runs")
        addition.add_argument("--failed", help="a pattern for the lines it picks once the command failed, such as its failures; the pattern picks them while it runs")
        addition.add_argument("--commands", help="the commands whose output it reads, comma-separated, such as pytest or dotnet test: a command moved to the background that runs one is told to watch it with this reader")
        self.verb(verbs, "list", "the project's readers, each with what it picks")

    def add(self, args: Namespace, caller: Caller) -> int:
        if not NAME.fullmatch(args.name):
            raise Rejection(f"a reader's name is lowercase words joined by -, such as failed-tests, not {args.name}")
        prior = self.readers.pattern_reader(args.name)
        if prior is None and not args.about:
            raise Rejection("a new reader says what it picks with --about")
        if args.script:
            self.readers.add_script(args.name, args.about or prior.subject, args.script, self.commands(args, prior))
        else:
            reader = (prior or Reader(args.name, args.about, args.pattern)).revised(subject=args.about, pattern=args.pattern, progress_pattern=args.progress, label=None if args.label is None else ActivityTitle.checked(args.label), commands=None if args.commands is None else ReaderCommands.parsed(args.commands), step_pattern=args.step, topic_pattern=args.topic, finished_pattern=args.finished, failed_pattern=args.failed)
            for pattern in (reader.pattern, reader.progress_pattern, reader.finished_pattern, reader.failed_pattern):
                re.compile(pattern)
            self.readers.add(reader)
        for output in self.outputs.reader_outputs(args.name):
            self.views.card(output)
        print(f"reader {args.name} added: journal output read N --reader {args.name}")
        return 0

    @staticmethod
    def commands(args: Namespace, prior: Reader | None) -> ReaderCommands:
        if args.commands is not None:
            return ReaderCommands.parsed(args.commands)
        return prior.commands if prior else ReaderCommands()

    def list(self, args: Namespace, caller: Caller) -> int:
        for reader in self.readers.all():
            print(f"{reader.name}: {reader.subject}")
        return 0
