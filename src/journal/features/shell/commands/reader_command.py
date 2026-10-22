import re
from argparse import Namespace
from pathlib import Path

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

    def __init__(self, readers: Readers) -> None:
        self.readers = readers

    def arguments(self, verbs) -> None:
        addition = self.verb(verbs, "add", "a reader kept in .journal/readers/: the lines a pattern matches, or what a script handed the output prints")
        addition.add_argument("name")
        source = addition.add_mutually_exclusive_group(required=True)
        source.add_argument("--pattern")
        source.add_argument("--script", type=Path, help="a shell script given the output on its input")
        addition.add_argument("--about", required=True, help="what it picks, in a few words")
        addition.add_argument("--progress", default="", help="a pattern whose last match says how far the command has come: one group for a percentage, two for a count of a total")
        addition.add_argument("--label", default="", help="the words shown in front of the progress")
        addition.add_argument("--step", default="", help="a pattern for one step, such as a test's dot, that moves the progress between two of its counts")
        addition.add_argument("--commands", default="", help="the commands whose output it reads, comma-separated, such as pytest or dotnet test: a command moved to the background that runs one is told to watch it with this reader")
        self.verb(verbs, "list", "the project's readers, each with what it picks")

    def add(self, args: Namespace, caller: Caller) -> int:
        if not NAME.fullmatch(args.name):
            raise Rejection(f"a reader's name is lowercase words joined by -, such as failed-tests, not {args.name}")
        if args.script:
            self.readers.add_script(args.name, args.about, args.script, ReaderCommands.parsed(args.commands))
        else:
            re.compile(args.pattern)
            re.compile(args.progress)
            self.readers.add(Reader(args.name, args.about, args.pattern, args.progress, args.label, ReaderCommands.parsed(args.commands), args.step))
        print(f"reader {args.name} added: journal output read N --reader {args.name}")
        return 0

    def list(self, args: Namespace, caller: Caller) -> int:
        for reader in self.readers.all():
            print(f"{reader.name}: {reader.subject}")
        return 0
