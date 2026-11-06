from argparse import ArgumentParser, Namespace
from dataclasses import dataclass

from core.base.caller.caller import Caller
from core.base.refusal import Refusal
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.triggers.models.enums.trigger_match import TriggerMatch


@dataclass(frozen=True)
class TriggerTrial:
    """Whether a trigger's words match a sentence, without firing it."""

    matches: bool
    phrases: tuple[str, ...]


class TryTriggerSubcommand(ReadSubcommand[TriggerTrial]):
    """Tries trigger words against a sentence with the same matching as the agent's rules."""

    cli_name = "trigger"
    name = "try"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("phrases")
        parser.add_argument("sentence")
        parser.add_argument("--match-mode", type=TriggerMatch, choices=list(TriggerMatch), default=TriggerMatch.WORD)

    def read(self, arguments: Namespace, caller: Caller) -> TriggerTrial:
        phrases = tuple(phrase.strip() for phrase in arguments.phrases.split(",") if phrase.strip())
        if any(arguments.match_mode.refuses(phrase) for phrase in phrases):
            raise Refusal("this pattern is too long or repeats a repeat", "write a simpler pattern")
        matched = tuple(phrase for phrase in phrases if arguments.match_mode.finds(phrase, arguments.sentence))
        return TriggerTrial(bool(matched), matched)
