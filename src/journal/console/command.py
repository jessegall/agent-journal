from argparse import ArgumentParser, Namespace
from typing import ClassVar
from journal.console.support.chained_line import ChainedLine

from journal.support.caller import Caller
from journal.support.caller_kind import CallerKind

PRINCIPAL_KINDS = frozenset({CallerKind.MAIN_AGENT, CallerKind.USER, CallerKind.PLUGIN})
HELPER_KINDS = frozenset({CallerKind.WORKER, CallerKind.SUBAGENT})
WORKER_KINDS = frozenset({CallerKind.WORKER})
SUBAGENT_KINDS = frozenset({CallerKind.SUBAGENT})


class Command:
    """One noun; each verb is a method named after it, taking the parsed arguments and where and by whom it runs. The main agent, the user and a plugin run every verb; a worker or a subagent runs only the verbs whose callers name its kind."""

    noun: ClassVar[str]
    default_verb: ClassVar[str] = ""
    callers: ClassVar[dict[str, frozenset[CallerKind]]] = {}

    def admits(self, verb: str, kind: CallerKind) -> bool:
        return kind in PRINCIPAL_KINDS or kind in self.callers.get(verb, frozenset())

    def arguments(self, verbs) -> None:
        ...

    def perform(self, args: Namespace, caller: Caller) -> int:
        return (getattr(self, f"{args.verb}_", None) or getattr(self, args.verb))(args, caller)

    def chained(self, args: Namespace, caller: Caller) -> list[ChainedLine]:
        chain = getattr(self, f"{args.verb}_chain", None)
        return chain(args, caller) if chain else []

    @staticmethod
    def verb(verbs, name: str, help: str) -> ArgumentParser:
        parser = verbs.add_parser(name, help=help)
        parser.set_defaults(verb=name)
        return parser
