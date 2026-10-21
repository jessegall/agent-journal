import re
from argparse import Namespace
from pathlib import Path

from journal.console.command import Command
from journal.support.caller import Caller
from journal.features.shell.support.reader import Reader
from journal.features.shell.support.readers import Readers
from journal.support.rejection import Rejection

NAME = re.compile(r"[a-z0-9][a-z0-9-]*")


class ReaderCommand(Command):
    """The project's output readers: add one for a shape of output read again and again, and list them."""

    noun = "reader"

    def __init__(self, readers: Readers) -> None:
        self.readers = readers

    def arguments(self, verbs) -> None:
        addition = self.verb(verbs, "add", "a reader kept in .journal/readers/: the lines a pattern matches, or what a script handed the output prints")
        addition.add_argument("name")
        source = addition.add_mutually_exclusive_group(required=True)
        source.add_argument("--pattern")
        source.add_argument("--script", type=Path, help="a shell script given the output on its input")
        addition.add_argument("--about", required=True, help="what it picks, in a few words")
        self.verb(verbs, "list", "the project's readers, each with what it picks")

    def add(self, args: Namespace, caller: Caller) -> int:
        if not NAME.fullmatch(args.name):
            raise Rejection(f"a reader's name is lowercase words joined by -, such as failed-tests, not {args.name}")
        if args.script:
            self.readers.add_script(args.name, args.subject, args.script)
        else:
            re.compile(args.pattern)
            self.readers.add(Reader(args.name, args.subject, args.pattern))
        print(f"reader {args.name} added: journal output read N --reader {args.name}")
        return 0

    def list(self, args: Namespace, caller: Caller) -> int:
        for reader in self.readers.all():
            print(f"{reader.name}: {reader.subject}")
        return 0
