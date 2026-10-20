import time

from journal.features.suggestions.support.package_commandments import PackageCommandments
from journal.features.suggestions.support.suggester import Suggester
from journal.models.environment import Environment
from journal.models.suggestion import Suggestion
from journal.models.suggestion_answer import SuggestionAnswer
from journal.repositories.agents import Agents
from journal.repositories.environments import Environments
from journal.repositories.messages import Messages
from journal.repositories.settings import Settings
from journal.repositories.suggestions import Suggestions
from journal.support.actor import Actor
from journal.support.cards import Cards
from journal.support.not_found import NotFound
from journal.support.refused import Refused

MINUTE = 60


class Suggesting:
    """Rounds of suggestions: the first a while after the journal started, then one each interval; a round makes each suggestion that applies and was never made, as one card in the chat the user answers once."""

    def __init__(self, settings: Settings, suggestions: Suggestions, cards: Cards, agents: Agents, environments: Environments, messages: Messages, commandments: PackageCommandments) -> None:
        self.settings, self.suggestions, self.cards, self.agents, self.environments, self.messages = settings, suggestions, cards, agents, environments, messages
        self.suggesters: tuple[Suggester, ...] = (commandments,)
        self.started_at = time.time()
        self.last_round: float | None = None

    def tick(self, now: float) -> None:
        if now < self.next_round():
            return
        self.last_round = now
        self.round()

    def next_round(self) -> float:
        from journal.features.suggestions.feature import SuggestionsFeature
        if self.last_round is None:
            return self.started_at + float(self.settings.option(SuggestionsFeature.FIRST_AFTER)) * MINUTE
        return self.last_round + float(self.settings.option(SuggestionsFeature.EVERY)) * MINUTE

    def round(self) -> list[Suggestion]:
        """Each suggestion that applies now and was never made, made and shown."""
        return [self.made(suggester) for suggester in self.suggesters if not self.suggestions.was_made(suggester.key) and suggester.applies()]

    def made(self, suggester: Suggester) -> Suggestion:
        row = self.suggestions.save(Suggestion(key=suggester.key, title=suggester.title()), Actor.system())
        self.shown(row, suggester, self.where_shown().id)
        return row

    def answer(self, suggestion: Suggestion, answer: SuggestionAnswer, by: Actor) -> str:
        """The user's answer kept, the card settled in place; an accepted one names where the viewer goes to finish it."""
        if suggestion.is_answered():
            raise Refused(f"suggestion {suggestion.id} was answered already: {suggestion.answer}")
        answered = self.suggestions.save(suggestion.answered(answer), by)
        suggester = self.named(suggestion.key)
        self.shown(answered, suggester, self.card_environment(answered))
        return suggester.goes_to() if answer == SuggestionAnswer.ACCEPTED else ""

    def shown(self, suggestion: Suggestion, suggester: Suggester, environment_id: int) -> None:
        data = {"kind": "suggestion", "icon": "bulb", "detail": suggester.detail(), "row": f"suggestions:{suggestion.id}", "accept": suggester.accept_label, "answer": suggestion.answer or ""}
        self.cards.keyed(environment_id, self.card_key(suggestion), suggestion.title, data, Actor.system())

    def card_environment(self, suggestion: Suggestion) -> int:
        """The environment the suggestion's card stands in."""
        return self.messages.keyed(self.card_key(suggestion), Actor.system())[0].environment_id

    def named(self, key: str) -> Suggester:
        found = [s for s in self.suggesters if s.key == key]
        if not found:
            raise NotFound("suggesters", key)
        return found[0]

    def where_shown(self) -> Environment:
        """The environment of the agent most lately at work, else the first: a suggestion is the project's, shown once."""
        live = sorted((a for a in self.agents.everywhere() if a.state != "ended"), key=lambda a: a.updated_at)
        return self.environments.find(live[-1].environment_id) if live else self.environments.all()[0]

    @staticmethod
    def card_key(suggestion: Suggestion) -> str:
        return f"suggestion:{suggestion.id}"
