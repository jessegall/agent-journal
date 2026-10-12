from controllers.suggestions import Decision
from events import Fact
from events.suggestions import AnswerTakenBack, SuggestionCompleted, SuggestionFiled, SuggestionReopened, SuggestionToFile, UserAnswered
from receiving import Listener
from resources.base import USER
from resources.types import AgentRow, Suggestion
from serving import ReadRows


SAID = {Decision.ACCEPT: "You said yes to suggestion", Decision.ADJUST: "You changed suggestion", Decision.DECLINE: "You said no to suggestion"}


def answered(suggestion: Suggestion, actor: str, agents, todo: int = 0) -> list[Fact]:
    """The user's answer as a mark in the chat; the agent's own answer leaves none."""
    decision = Decision(suggestion.decision)
    if actor != USER or decision not in SAID or not agents.has_primary():
        return []
    return [UserAnswered(n=suggestion.n, label=SAID[decision], detail=f"Added to-do {todo}" if todo else "")]


class SpotDecidedSuggestion(Listener[SuggestionCompleted]):
    def listen(self, event: SuggestionCompleted, suggestions: ReadRows[Suggestion], agents: ReadRows[AgentRow]) -> list[Fact]:
        suggestion = suggestions.peek(event.n)
        if Decision(suggestion.decision).files_todo():
            return [SuggestionToFile(n=event.n, actor=event.actor)]
        return answered(suggestion, event.actor, agents)


class SpotFiledSuggestion(Listener[SuggestionFiled]):
    def listen(self, event: SuggestionFiled, suggestions: ReadRows[Suggestion], agents: ReadRows[AgentRow]) -> list[Fact]:
        return answered(suggestions.peek(event.n), event.actor, agents, event.todo)


class SpotTakenBackAnswer(Listener[SuggestionReopened]):
    def listen(self, event: SuggestionReopened, agents: ReadRows[AgentRow]) -> list[Fact]:
        return [AnswerTakenBack(n=event.n)] if agents.has_primary() else []
