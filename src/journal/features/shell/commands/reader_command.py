import re
from argparse import Namespace
from pathlib import Path

from journal.console.command import Command
from journal.support.where import Where
from journal.features.shell.reader import Reader
from journal.features.shell.readers import Readers
from journal.support.refused import Refused

NAME = re.compile(r"[a-z0-9][a-z0-9-]*")


class ReaderCommand(Command):
    """The project's output readers: add one for a shape of output read again and again, and list them."""

    noun = "reader"

    def __init__(self, readers: Readers) -> None:
        self.readers = readers

    def arguments(self, verbs) -> None:
        add = self.verb(verbs, "add", "a reader kept in .journal/readers/: the lines a pattern matches, or what a script handed the output prints")
        add.add_argument("name")
        made = add.add_mutually_exclusive_group(required=True)
        made.add_argument("--pattern")
        made.add_argument("--script", type=Path, help="a shell script given the output on its input")
        add.add_argument("--about", required=True, help="what it picks, in a few words")
        self.verb(verbs, "list", "the project's readers, each with what it picks")

    def add(self, args: Namespace, where: Where) -> int:
        if not NAME.fullmatch(args.name):
            raise Refused(f"a reader's name is lowercase words joined by -, such as failed-tests, not {args.name}")
        if args.script:
            self.readers.add_script(args.name, args.about, args.script)
        else:
            re.compile(args.pattern)
            self.readers.add(Reader(args.name, args.about, args.pattern))
        print(f"reader {args.name} added: journal output read N --reader {args.name}")
        return 0

    def list(self, args: Namespace, where: Where) -> int:
        for reader in self.readers.all():
            print(f"{reader.name}: {reader.about}")
        return 0
