from features.base import Feature
from features.journal import Journal
from features.recital import RepeatStanding, WhisperOnKeyword, WhisperOnKeywordInChat
from features.reminders.details import RemindersDetails


class RemindersFeature(Feature):
    details = RemindersDetails

    def register(self, journal: Journal) -> None:
        journal.agent.interceptor(WhisperOnKeyword("reminders"))
        journal.events.handler(WhisperOnKeywordInChat("reminders"))
        journal.events.handler(RepeatStanding("reminders"))
