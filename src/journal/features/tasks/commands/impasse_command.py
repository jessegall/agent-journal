from argparse import Namespace

from journal.console.command import WORKER_KINDS, Command
from journal.support.caller import Caller
from journal.chat.moment_cards import MomentCards
from journal.hooks.command_events import CommandEvents
from journal.repositories.scope import Scope
from journal.support.card_kind import CardKind


class ImpasseCommand(Command):
    """journal stuck "<why>": the agent is truly stuck, so the journal says nothing until its next tool use or prompt."""

    noun = "stuck"
    callers = {"declare": WORKER_KINDS}
    default_verb = "declare"

    def __init__(self, events: CommandEvents, cards: MomentCards, scope: Scope) -> None:
        self.events, self.cards, self.scope = events, cards, scope

    def arguments(self, verbs) -> None:
        self.verb(verbs, "declare", "say why you are stuck").add_argument("why")

    def declare(self, args: Namespace, caller: Caller) -> int:
        self.events.help_needed(args.why, caller)
        self.cards.show(self.scope.id, caller.agent_session, "Agent stuck", "warn", "bad", args.why, shows=CardKind.IMPASSE)
        print("stuck; your next tool use or prompt lifts it")
        return 0
