from journal.models.fact import Fact
from journal.models.model import Model
from journal.models.reminder import Reminder
from journal.models.rule import Rule
from journal.support.actor import Actor
from journal.support.actor_kind import ActorKind
from journal.chat.cards import Cards
from journal.support.card_kind import CardKind
from journal.models.support.ref import Ref
from journal.repositories.scope import Scope

MEMORY_KINDS = {Fact: ("Fact", CardKind.FACTS), Rule: ("Rule", CardKind.RULES), Reminder: ("Reminder", CardKind.REMINDERS)}


class MemoryCards:
    """A card in the chat for what happened to a fact, a rule or a reminder: its noun, number and the verb, and the row it opens; a rule, which is the project's, is shown in the environment of the act."""

    def __init__(self, cards: Cards, scope: Scope) -> None:
        self.cards, self.scope = cards, scope

    def show(self, row: Model, actor: Actor, verb: str, icon: str = "rules", tone: str = "") -> None:
        if type(row) not in MEMORY_KINDS:
            return
        noun, shows = MEMORY_KINDS[type(row)]
        environment = getattr(row, "environment_id", 0) or self.scope.id
        session = actor.id if actor.kind == ActorKind.AGENT else ""
        self.cards.show(environment, session, f"{noun} {row.id} {verb}{self.moment(row)}", icon, tone, "", Ref.build(row), actor=actor, shows=shows)

    @staticmethod
    def moment(row: Model) -> str:
        return f", due {row.due_at.astimezone().strftime(Reminder.MOMENT)}" if isinstance(row, Reminder) and row.due_at else ""
