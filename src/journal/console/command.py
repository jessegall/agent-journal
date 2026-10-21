from argparse import ArgumentParser, Namespace
from typing import ClassVar

from journal.support.caller import Caller


class Command:
    """One noun; each verb is a method named after it, taking the parsed arguments and where and by whom it runs."""

    noun: ClassVar[str]
    default_verb: ClassVar[str] = ""
    always_allowed: ClassVar[bool] = False

    def arguments(self, verbs) -> None:
        ...

    def perform(self, args: Namespace, caller: Caller) -> int:
        return (getattr(self, f"{args.verb}_", None) or getattr(self, args.verb))(args, caller)

    @staticmethod
    def verb(verbs, name: str, help: str) -> ArgumentParser:
        parser = verbs.add_parser(name, help=help)
        parser.set_defaults(verb=name)
        return parser
