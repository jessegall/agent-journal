from expects import Dispatches, Given, Updated, Wrote, nothing
from framework.base import Feature
from controllers.types import Suggestions
from declaring.registries import SUMMARY_COUNTS
from framework.journal import Journal
from features.suggestions.details import SuggestionsDetails
from features.suggestions.handlers import DropTakenBackMark, FileDecidedSuggestion, ShowAnswerInChat
from features.suggestions.listeners import SpotDecidedSuggestion, SpotFiledSuggestion, SpotTakenBackAnswer
from events.suggestions import AnswerTakenBack, SuggestionCompleted, SuggestionFiled, SuggestionReopened, SuggestionToFile, UserAnswered
from resources.base import AGENT, SYSTEM, USER
from resources.types import AgentRow, Suggestion, Todo


AGENT_ROW = AgentRow(n=1, title="claude-1")


def proposed(how: str, outcome: str = "") -> Suggestion:
    return Suggestion(n=3, title="Run the gate in CI", brief="It catches the slow request early.", data={"decision": how}, outcome=outcome)


def decided(actor: str = USER) -> SuggestionCompleted:
    return SuggestionCompleted(n=3, type="suggestion", action="completed", actor=actor)


def waiting_suggestions(record) -> int:
    return len(Suggestions(record, actor=SYSTEM).rows.standing())


class SuggestionsFeature(Feature):
    details = SuggestionsDetails

    def register(self, journal: Journal) -> None:
        SUMMARY_COUNTS.add(None, waiting_suggestions, key="suggestions")
        journal.events.listen(SuggestionCompleted, SpotDecidedSuggestion(), expects=[
            Given(decided(), rows=[proposed("accept"), AGENT_ROW]) >> Dispatches(SuggestionToFile(n=3, actor=USER)),
            Given(decided(), rows=[proposed("adjust", "Run it nightly instead"), AGENT_ROW]) >> Dispatches(SuggestionToFile(n=3, actor=USER)),
            Given(decided(AGENT), rows=[proposed("accept"), AGENT_ROW]) >> Dispatches(SuggestionToFile(n=3, actor=AGENT)),
            Given(decided(), rows=[proposed("decline", "Too slow for every push"), AGENT_ROW]) >> Dispatches(UserAnswered(n=3, label="You said no to suggestion", detail="")),
            Given(decided(AGENT), rows=[proposed("decline", "Too slow for every push"), AGENT_ROW]) >> Dispatches(nothing),
            Given(decided(), rows=[proposed("decline", "Too slow for every push")]) >> Dispatches(nothing),
            Given(decided(), rows=[proposed("install", "Install the hook"), AGENT_ROW]) >> Dispatches(nothing),
            Given(decided(), rows=[proposed(""), AGENT_ROW]) >> Dispatches(nothing),
        ])
        journal.events.handle(SuggestionToFile, FileDecidedSuggestion(), expects=[
            Given(SuggestionToFile(n=3, actor=USER), rows=[proposed("accept")])
                >> Wrote(Todo(title="Run the gate in CI", brief="It catches the slow request early.")) & Updated(Suggestion(n=3), todo=1)
                & Dispatches(SuggestionFiled(n=3, todo=1, actor=USER)),
            Given(SuggestionToFile(n=3, actor=USER), rows=[proposed("adjust", "Run it nightly instead")])
                >> Wrote(Todo(title="Run it nightly instead")) & Updated(Suggestion(n=3), todo=1),
            Given(SuggestionToFile(n=3, actor=AGENT), rows=[proposed("accept")]) >> Dispatches(SuggestionFiled(n=3, todo=1, actor=AGENT)),
            Given(SuggestionToFile(n=3, actor=USER), rows=[proposed("adjust", "x" * 120)]) >> Wrote(Todo(title="x" * 80)),
            Given(SuggestionToFile(n=3, actor=USER), rows=[proposed("adjust", "Run it nightly\nThe push build is too slow")]) >> Wrote(Todo(title="Run it nightly")),
        ])
        journal.events.listen(SuggestionFiled, SpotFiledSuggestion(), expects=[
            Given(SuggestionFiled(n=3, todo=1, actor=USER), rows=[proposed("accept"), AGENT_ROW])
                >> Dispatches(UserAnswered(n=3, label="You said yes to suggestion", detail="Added to-do 1")),
            Given(SuggestionFiled(n=3, todo=1, actor=AGENT), rows=[proposed("accept"), AGENT_ROW]) >> Dispatches(nothing),
            Given(SuggestionFiled(n=3, todo=1, actor=USER), rows=[proposed("adjust", "Run it nightly instead"), AGENT_ROW])
                >> Dispatches(UserAnswered(n=3, label="You changed suggestion", detail="Added to-do 1")),
            Given(SuggestionFiled(n=3, todo=1, actor=USER), rows=[proposed("accept")]) >> Dispatches(nothing),
        ])
        journal.events.handle(UserAnswered, ShowAnswerInChat(), expects=[
            Given(UserAnswered(n=3, label="You said yes to suggestion", detail="Added to-do 1"), rows=[proposed("accept"), AGENT_ROW])
                >> Updated(AgentRow(n=1), cards=[{"key": "suggestion:3", "label": "You said yes to suggestion", "detail": "Added to-do 1", "side": USER, "name": "3"}]),
        ])
        journal.events.listen(SuggestionReopened, SpotTakenBackAnswer(), expects=[
            Given(SuggestionReopened(n=3, type="suggestion", action="reopened", actor=USER), rows=[proposed("accept"), AGENT_ROW]) >> Dispatches(AnswerTakenBack(n=3)),
            Given(SuggestionReopened(n=3, type="suggestion", action="reopened", actor=USER), rows=[proposed("accept")]) >> Dispatches(nothing),
        ])
        journal.events.handle(AnswerTakenBack, DropTakenBackMark(), expects=[
            Given(AnswerTakenBack(n=3), rows=[proposed("accept"), AgentRow(n=1, title="claude-1", data={"cards": [{"key": "suggestion:3", "label": "x"}]})])
                >> Updated(AgentRow(n=1), cards=[]),
        ])
