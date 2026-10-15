from argparse import Namespace

from journal.console.command import Command
from journal.console.where import Where
from journal.engine.cards import Cards
from journal.engine.machine import Machine
from journal.features.tasks.states.halted import Halted
from journal.repositories.environments import Environments


class HaltCommand(Command):
    """journal halt "<why>": the agent is truly stuck, so the journal says nothing until its next tool use or prompt."""

    noun = "halt"

    def __init__(self, machine: Machine, environments: Environments, cards: Cards) -> None:
        self.machine, self.environments, self.cards = machine, environments, cards

    def arguments(self, verbs) -> None:
        self.verb(verbs, "now", "say why you are stuck").add_argument("why")

    def now(self, args: Namespace, where: Where) -> int:
        environment = self.environments.named(where.environment).id
        current = self.machine.agent(where.session, environment)
        self.machine.move(where.session, environment, Halted.leaving(self.machine.states.named(current.state, current.data), why=args.why))
        self.cards.show(environment, where.session, "Agent halted", "warn", "bad", args.why)
        print("halted; your next tool use or prompt lifts it")
        return 0
