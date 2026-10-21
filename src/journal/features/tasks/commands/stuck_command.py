from argparse import Namespace

from journal.console.command import Command
from journal.support.caller import Caller
from journal.support.cards import Cards
from journal.hooks.command_events import CommandEvents
from journal.support.scope import Scope
from journal.support.chat_mark import ChatMark


class StuckCommand(Command):
    """journal stuck "<why>": the agent is truly stuck, so the journal says nothing until its next tool use or prompt."""

    noun = "stuck"
    default_verb = "now"

    def __init__(self, events: CommandEvents, cards: Cards, scope: Scope) -> None:
        self.events, self.cards, self.scope = events, cards, scope

    def arguments(self, verbs) -> None:
        self.verb(verbs, "now", "say why you are stuck").add_argument("why")

    def now(self, args: Namespace, caller: Caller) -> int:
        self.events.help_needed(args.why, caller)
        self.cards.show(self.scope.id, caller.session, "Agent stuck", "warn", "bad", args.why, shows=ChatMark.IMPASSE)
        print("stuck; your next tool use or prompt lifts it")
        return 0
