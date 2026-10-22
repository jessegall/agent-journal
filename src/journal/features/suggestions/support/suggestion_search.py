import time as timing

from journal.features.suggestions.support.package_commandments import PackageCommandments
from journal.features.suggestions.support.suggester import Suggester
from journal.models.environment import Environment
from journal.models.suggestion import Suggestion
from journal.models.suggestion_answer import SuggestionAnswer
from journal.repositories.agents import Agents
from journal.repositories.environments import Environments
from journal.repositories.messages import Messages
from journal.repositories.setting_rows import SettingRows
from journal.repositories.suggestions import Suggestions
from journal.support.actor import Actor
from journal.chat.cards import Cards
from journal.support.missing_row import MissingRow
from journal.support.rejection import Rejection
from journal.repositories.scope import Scope
from journal.support.card_kind import CardKind

MINUTE_SECONDS = 60


class SuggestionSearch:
    """Rounds of suggestions: the first a while after the journal started, then one each interval; a round makes each suggestion that applies and was never made, as one card in the chat the user answers once."""

    def __init__(self, settings: SettingRows, suggestions: Suggestions, cards: Cards, agents: Agents, environments: Environments, messages: Messages, scope: Scope, commandments: PackageCommandments) -> None:
        self.settings, self.suggestions, self.cards, self.agents, self.environments, self.messages, self.scope = settings, suggestions, cards, agents, environments, messages, scope
        self.suggesters: tuple[Suggester, ...] = (commandments,)
        self.started_at = timing.time()
        self.last_round: float | None = None

    def tick(self, time: float) -> None:
        if time < self.next_round():
            return
        self.last_round = time
        self.round()

    def next_round(self) -> float:
        from journal.features.suggestions.feature import SuggestionsFeature
        if self.last_round is None:
            return self.started_at + self.settings.decimal(SuggestionsFeature.FIRST_DELAY) * MINUTE_SECONDS
        return self.last_round + self.settings.decimal(SuggestionsFeature.INTERVAL) * MINUTE_SECONDS

    def round(self) -> list[Suggestion]:
        return [self.created(suggester) for suggester in self.suggesters if not self.suggestions.is_recorded(suggester.key) and suggester.applies()]

    def created(self, suggester: Suggester) -> Suggestion:
        row = self.suggestions.save(Suggestion(key=suggester.key, title=suggester.title()), Actor.system())
        environment_id = self.target_environment().row_id
        with self.scope.environment(environment_id):
            self.shown(row, suggester, environment_id)
        return row

    def answer(self, suggestion: Suggestion, answer: SuggestionAnswer, actor: Actor) -> str:
        if suggestion.is_answered():
            raise Rejection(f"suggestion {suggestion.id} was answered already: {suggestion.answer}")
        answered = self.suggestions.save(suggestion.answered(answer), actor)
        suggester = self.lookup(suggestion.key)
        environment_id = self.card_environment(answered)
        with self.scope.environment(environment_id):
            self.shown(answered, suggester, environment_id)
        return suggester.target() if answer == SuggestionAnswer.ACCEPTED else ""

    def shown(self, suggestion: Suggestion, suggester: Suggester, environment_id: int) -> None:
        data = {"kind": "suggestion", "icon": "bulb", "row": f"suggestions:{suggestion.id}", "accept": suggester.accept_label, "answer": suggestion.answer or ""}
        self.cards.keyed(environment_id, self.card_key(suggestion), suggestion.title, data, Actor.system(), CardKind.SUGGESTIONS, suggester.detail())

    def card_environment(self, suggestion: Suggestion) -> int:
        return self.messages.keyed_all(self.card_key(suggestion), Actor.system())[0].environment_id

    def lookup(self, key: str) -> Suggester:
        rows = [s for s in self.suggesters if s.key == key]
        if not rows:
            raise MissingRow("suggesters", key)
        return rows[0]

    def target_environment(self) -> Environment:
        present = self.agents.all_current()
        return self.environments.find(present.environment_id) if present else self.environments.all()[0]

    @staticmethod
    def card_key(suggestion: Suggestion) -> str:
        return f"suggestion:{suggestion.id}"
