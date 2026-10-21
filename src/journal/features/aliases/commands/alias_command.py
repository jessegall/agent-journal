import re
from argparse import Namespace

from journal.console.command import Command
from journal.features.aliases.support.alias_names import AliasNames
from journal.features.shell.support.readers import Readers
from journal.models.alias import Alias
from journal.repositories.aliases import Aliases
from journal.support.caller import Caller
from journal.support.rejection import Rejection

NAME = re.compile(r"[a-z0-9][a-z0-9-]*")


class AliasCommand(Command):
    """The project's aliases: a name for a command line, run as journal <name> with the arguments passed on to the line's end and its output watched through its reader."""

    noun = "alias"

    def __init__(self, aliases: Aliases, names: AliasNames, readers: Readers) -> None:
        self.aliases, self.names, self.readers = aliases, names, readers

    def arguments(self, verbs) -> None:
        addition = self.verb(verbs, "add", "name a command line: journal <name> [args] runs it in the project with the args at its end")
        addition.add_argument("name")
        addition.add_argument("line")
        addition.add_argument("--reader", default="", help="the reader that reads its output; a run moved to the background is watched through it")
        addition.add_argument("--about", dest="description", default="", help="what it does, in a few words")
        addition.add_argument("--env", dest="variables", action="append", default=[], metavar="KEY=VALUE", help="a variable put before the line; more than one may be given")
        self.verb(verbs, "list", "the project's aliases, each with its line and its reader")
        edit = self.verb(verbs, "edit", "change an alias's line, reader or what it does")
        edit.add_argument("name")
        edit.add_argument("--line")
        edit.add_argument("--reader")
        edit.add_argument("--about", dest="description")
        self.verb(verbs, "remove", "take an alias away").add_argument("name")

    def add(self, args: Namespace, caller: Caller) -> int:
        if not NAME.fullmatch(args.name):
            raise Rejection(f"an alias's name is lowercase words joined by -, such as test-all, not {args.name}")
        refusal = self.names.refusal(args.name)
        if refusal:
            raise Rejection(refusal)
        self.reader_check(args.reader)
        self.aliases.save(Alias(name=args.name, line=args.line, reader=args.reader, description=args.description, variables=self.assignments(args.variables)), caller.actor)
        print(f"alias {args.name} added: journal {args.name} [args] runs {args.line}")
        return 0

    def list(self, args: Namespace, caller: Caller) -> int:
        for alias in self.aliases.rows():
            print(f"{alias.name:<20} {alias.line}" + (f"  (reader {alias.reader})" if alias.reader else ""))
        return 0

    def edit(self, args: Namespace, caller: Caller) -> int:
        alias = self.aliases.single(name=args.name)
        if args.reader:
            self.reader_check(args.reader)
        changes = {key: value for key in ("line", "reader", "description") if (value := getattr(args, key)) is not None}
        self.aliases.save(alias.with_(**changes), caller.actor)
        print(f"alias {args.name} changed")
        return 0

    def remove(self, args: Namespace, caller: Caller) -> int:
        self.aliases.delete(self.aliases.single(name=args.name), caller.actor)
        print(f"alias {args.name} removed")
        return 0

    def reader_check(self, reader: str) -> None:
        if reader:
            self.readers.lookup(reader)

    @staticmethod
    def assignments(pairs: list[str]) -> dict[str, str]:
        malformed = [pair for pair in pairs if "=" not in pair]
        if malformed:
            raise Rejection(f"--env takes KEY=VALUE, not {malformed[0]}")
        return dict(pair.split("=", 1) for pair in pairs)
