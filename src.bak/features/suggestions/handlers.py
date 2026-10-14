from resources.suggestions import Decision
from events import Fact
from events.suggestions import AnswerTakenBack, SuggestionFiled, SuggestionToFile, UserAnswered
from resources.base import USER
from receiving import Handler
from resources.types import AgentRow, Suggestion, Todo
from serving import Rows


def mark_key(n: int) -> str:
    return f"suggestion:{n}"


class FileDecidedSuggestion(Handler[SuggestionToFile]):
    def handle(self, event: SuggestionToFile, suggestions: Rows[Suggestion], todos: Rows[Todo]) -> list[Fact]:
        s = suggestions.load(event.n)
        accepted = Decision(s.decision) == Decision.ACCEPT
        title = s.title if accepted else s.outcome.split("\n")[0][:80]
        brief = s.brief if accepted else f"{s.outcome}\n\nProposed as: {s.title}\n{s.brief}".strip()
        made = todos.create(title, brief=brief, about=s.ref)
        suggestions.update(s.n, todo=made.n)
        return [SuggestionFiled(n=s.n, todo=made.n, actor=event.actor)]


class ShowAnswerInChat(Handler[UserAnswered]):
    def handle(self, event: UserAnswered, agents: Rows[AgentRow], suggestions: Rows[Suggestion]) -> list[Fact]:
        agents.card(agents.primary().n, key=mark_key(event.n), label=event.label, name=str(event.n), detail=event.detail,
                    icon="bulb", color="var(--blocking)", side=USER, row=suggestions.load(event.n).ref)
        return []


class DropTakenBackMark(Handler[AnswerTakenBack]):
    def handle(self, event: AnswerTakenBack, agents: Rows[AgentRow]) -> list[Fact]:
        agents.drop_card(agents.primary().n, mark_key(event.n))
        return []
