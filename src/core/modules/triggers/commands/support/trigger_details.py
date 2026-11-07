from argparse import ArgumentParser, Namespace
from dataclasses import dataclass

from core.modules.triggers.models.enums.trigger_match import TriggerMatch
from core.modules.triggers.models.trigger import ALL_PLACES


@dataclass(frozen=True)
class TriggerDetails:
    """What a new trigger holds besides what sets it off and its text, so one command saves all of it at once."""

    skill: str | None = None
    name: str = ""
    description: str = ""
    watch_places: tuple[str, ...] = ALL_PLACES
    match_mode: TriggerMatch = TriggerMatch.PART
    conditions: str = "[]"
    extra_actions: str = "[]"

    @staticmethod
    def add_arguments(parser: ArgumentParser) -> None:
        parser.add_argument("--skill")
        parser.add_argument("--name", default="")
        parser.add_argument("--description", default="")
        parser.add_argument("--watch-places", nargs="+", default=ALL_PLACES)
        parser.add_argument("--match-mode", type=TriggerMatch, choices=list(TriggerMatch), default=TriggerMatch.PART)
        parser.add_argument("--conditions", default="[]")
        parser.add_argument("--extra-actions", default="[]")

    @classmethod
    def parsed(cls, arguments: Namespace) -> "TriggerDetails":
        return cls(arguments.skill, arguments.name, arguments.description, tuple(arguments.watch_places), arguments.match_mode, arguments.conditions, arguments.extra_actions)
