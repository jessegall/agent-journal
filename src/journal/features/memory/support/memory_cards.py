from journal.models.fact import Fact
from journal.models.model import Model
from journal.models.reminder import Reminder
from journal.models.rule import Rule
from journal.support.actor import Actor
from journal.support.actor_kind import ActorKind
from journal.support.cards import Cards
from journal.support.chat_mark import ChatMark
from journal.support.ref import Ref
from journal.support.scope import Scope

MARKED = {Fact: ("Fact", ChatMark.FACTS), Rule: ("Rule", ChatMark.RULES), Reminder: ("Reminder", ChatMark.REMINDERS)}
"""The memory rows a card marks, by their noun and the chat's switch for them."""


class MemoryCards:
    """A card in the chat for what happened to a fact, a rule or a reminder: its noun and the verb, its words, and the row it opens; a rule, which is the project's, is shown in the environment of the act."""

    def __init__(self, cards: Cards, scope: Scope) -> None:
        self.cards, self.scope = cards, scope

    def show(self, row: Model, actor: Actor, verb: str) -> None:
        if type(row) not in MARKED:
            return
        noun, shows = MARKED[type(row)]
        environment = getattr(row, "environment_id", 0) or self.scope.id
        session = actor.id if actor.kind == ActorKind.AGENT else ""
        self.cards.show(environment, session, f"{noun} {verb}", "rules", "", row.text, str(Ref.to(row)), actor=actor, shows=shows)
