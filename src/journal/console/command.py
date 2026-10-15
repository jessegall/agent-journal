from argparse import ArgumentParser, Namespace
from typing import ClassVar

from journal.console.where import Where


class Command:
    """One noun; each verb is a method named after it, taking the parsed arguments and where and by whom it runs."""

    noun: ClassVar[str]

    def arguments(self, verbs) -> None:
        """Adds a parser per verb to the noun's subparsers."""
        ...

    def perform(self, args: Namespace, where: Where) -> int:
        """Runs the verb's method; a verb that is a Python keyword, such as await, has its method named with a trailing underscore."""
        return (getattr(self, f"{args.verb}_", None) or getattr(self, args.verb))(args, where)

    @staticmethod
    def verb(verbs, name: str, help: str) -> ArgumentParser:
        parser = verbs.add_parser(name, help=help)
        parser.set_defaults(verb=name)
        return parser
