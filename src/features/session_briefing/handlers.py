from events import Fact
from events.session_briefing import SessionGreeted, StartBlockStale
from features.session_briefing.block import rebuild
from receiving import Handler
from serving import Chat, Elsewhere, JournalRoot


class GreetTheSession(Handler[SessionGreeted]):
    def handle(self, event: SessionGreeted, chat: Chat) -> list[Fact]:
        chat.nudge("ready", env=event.env)
        return []


class RebuildTheStartBlock(Handler[StartBlockStale]):
    def handle(self, event: StartBlockStale, elsewhere: Elsewhere, journal_root: JournalRoot) -> list[Fact]:
        rebuild(elsewhere.here().record, journal_root)
        return []
