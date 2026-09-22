from features.base import Feature
from features.journal import Journal
from features.thinking.details import ThinkingDetails
from features.thinking.handlers import ClearOnMessage, FollowThinking


class Thinking(Feature):
    details = ThinkingDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(FollowThinking())
        journal.events.handler(ClearOnMessage())
