from argparse import Namespace

from journal.console.command import Command
from journal.support.where import Where
from journal.support.cards import Cards
from journal.engine.machine import Machine
from journal.features.tasks.states.stuck import Stuck
from journal.support.scope import Scope
from journal.support.chat_mark import ChatMark


class StuckCommand(Command):
    """journal stuck "<why>": the agent is truly stuck, so the journal says nothing until its next tool use or prompt."""

    noun = "stuck"
    default_verb = "now"

    def __init__(self, machine: Machine, cards: Cards, scope: Scope) -> None:
        self.machine, self.cards, self.scope = machine, cards, scope

    def arguments(self, verbs) -> None:
        self.verb(verbs, "now", "say why you are stuck").add_argument("why")

    def now(self, args: Namespace, where: Where) -> int:
        environment = self.scope.id
        current = self.machine.agent(where.session, environment)
        self.machine.move(where.session, environment, Stuck.leaving(self.machine.states.named(current.state, current.data), why=args.why))
        self.cards.show(environment, where.session, "Agent stuck", "warn", "bad", args.why, shows=ChatMark.STUCK)
        print("stuck; your next tool use or prompt lifts it")
        return 0
