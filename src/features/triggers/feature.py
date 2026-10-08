from features.base import Feature
from features.journal import Journal
from features.triggers.controller import Triggers
from features.triggers.details import TriggersDetails
from features.triggers.handlers import (DenyWhatTheAgentDoes, HoldWhileTheJournalShows, SayWhatTheJournalShowsOnTheClock, SayWhatTheJournalShowsOnToolUse,
                                       WatchWhatTheAgentDoes, WatchWhatTheAgentWrites, WatchWhatTheUserWrites)

__all__ = ["Triggers"]


class TriggersFeature(Feature):
    details = TriggersDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(WatchWhatTheUserWrites())
        journal.events.handler(WatchWhatTheAgentWrites())
        journal.events.handler(SayWhatTheJournalShowsOnTheClock())
        journal.events.handler(SayWhatTheJournalShowsOnToolUse())
        journal.events.handler(HoldWhileTheJournalShows())
        journal.agent.interceptor(DenyWhatTheAgentDoes())
        journal.agent.interceptor(WatchWhatTheAgentDoes())
