from expects import Given, Unchanged, Updated, Wrote
from framework.base import Feature
from controllers.suggestions import waiting_suggestions
from overview.parts import SUMMARY_COUNTS
from framework.journal import Journal
from features.suggestions.details import SuggestionsDetails
from features.suggestions.handlers import DropTakenBackMark, FileDecidedSuggestion
from events.suggestions import SuggestionCompleted, SuggestionReopened
from resources.base import AGENT, USER
from resources.types import AgentRow, Suggestion, Todo


AGENT_ROW = AgentRow(n=1, title="claude-1")


def proposed(how: str, outcome: str = "") -> Suggestion:
    return Suggestion(n=3, title="Run the gate in CI", brief="It catches the slow request early.", data={"decision": how}, outcome=outcome)


def decided(actor: str = USER) -> SuggestionCompleted:
    return SuggestionCompleted(n=3, type="suggestion", action="completed", actor=actor)


class SuggestionsFeature(Feature):
    details = SuggestionsDetails

    def register(self, journal: Journal) -> None:
        SUMMARY_COUNTS.add(None, waiting_suggestions, key="suggestions")
        journal.events.handler(FileDecidedSuggestion(), expects=[
            Given(decided(), rows=[proposed("accept"), AGENT_ROW]) >> Wrote(Todo(title="Run the gate in CI", brief="It catches the slow request early.")) & Updated(Suggestion(n=3), todo=1),
            Given(decided(), rows=[proposed("adjust", "Run it nightly instead"), AGENT_ROW]) >> Wrote(Todo(title="Run it nightly instead")) & Updated(Suggestion(n=3), todo=1),
            Given(decided(), rows=[proposed("decline", "Too slow for every push")]) >> Unchanged(),
            Given(decided(AGENT), rows=[proposed("accept"), AGENT_ROW]) >> Wrote(Todo(title="Run the gate in CI")),
        ])
        journal.events.handler(DropTakenBackMark(), expects=[
            Given(SuggestionReopened(n=3, type="suggestion", action="reopened", actor=USER), rows=[proposed("accept")]) >> Unchanged(),
        ])
