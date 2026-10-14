from argparse import ArgumentParser, Namespace
from typing import ClassVar

from journal.models.actor import Actor


class Command:
    """One noun; each verb is a method named after it, taking the parsed arguments and who ran it."""

    noun: ClassVar[str]

    def arguments(self, verbs) -> None:
        """Adds a parser per verb to the noun's subparsers."""
        ...

    def run(self, args: Namespace, by: Actor) -> int:
        return getattr(self, args.verb)(args, by)

    @staticmethod
    def verb(verbs, name: str, help: str) -> ArgumentParser:
        parser = verbs.add_parser(name, help=help)
        parser.set_defaults(verb=name)
        return parser
