from argparse import Namespace

from journal.console.command import Command
from journal.engine.nudge_registry import NudgeRegistry
from journal.support.where import Where


class NudgeCommand(Command):
    """journal nudge list: every line the journal can say to the agent, by its id, with its feature and its words."""

    noun = "nudge"

    def __init__(self, registry: NudgeRegistry) -> None:
        self.registry = registry

    def arguments(self, verbs) -> None:
        self.verb(verbs, "list", "every registered nudge: its id, its feature and its words")

    def list(self, args: Namespace, where: Where) -> int:
        for nudge in self.registry.all():
            words = f"{nudge.title}. {nudge.brief}" if nudge.brief else nudge.title
            print(f"{nudge.key}  [{nudge.feature or 'engine'}]  {words}")
        print(f"{len(self.registry.all())} nudges")
        return 0
