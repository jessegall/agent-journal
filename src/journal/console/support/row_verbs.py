from argparse import Namespace

from journal.support.docking import Docking
from journal.support.where import Where


class RowVerbs:
    """The verbs every row noun has beside its own: dock pins the row above the chat and undock takes it down."""

    def __init__(self, docking: Docking) -> None:
        self.docking = docking

    def of(self, noun: str) -> set[str]:
        return {"dock", "undock"} if noun in self.docking.nouns() else set()

    def add(self, noun: str, verbs) -> None:
        for verb, help in (("dock", f"pin the {noun} above the chat until the user opens or closes it"), ("undock", f"take the {noun} down from above the chat")):
            if verb in self.of(noun):
                verbs.add_parser(verb, help=help).add_argument("n", type=int)

    def has(self, noun: str, verb: str) -> bool:
        return verb in self.of(noun)

    def perform(self, args: Namespace, where: Where) -> int:
        message = getattr(self.docking, args.verb)(args.noun, args.n, where.actor)
        print(f"{message.data['heading']} {'docked above the chat' if args.verb == 'dock' else 'undocked'}")
        return 0
