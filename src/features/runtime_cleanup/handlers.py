from events import Fact
from events.runtime_cleanup import RuntimeTidyDue, UpdateInstalled
from features.runtime_cleanup.tidy import Tidy
from receiving import Handler
from serving import Clock, Elsewhere, JournalRoot, Providers, ReadSessions, Settings

TIDYING = "tidying.lock"
ONCE_EVERY = 50 * 60


class TidyRuntime(Handler[RuntimeTidyDue]):
    def handle(self, event: RuntimeTidyDue, root: JournalRoot, elsewhere: Elsewhere, sessions: ReadSessions, providers: Providers, clock: Clock, settings: Settings) -> list[Fact]:
        with root.swept(TIDYING, ONCE_EVERY) as mine:
            if mine:
                Tidy(root, elsewhere, sessions, providers, clock).everything(settings.days)
        return []


class TidyAfterUpdate(Handler[UpdateInstalled]):
    def handle(self, event: UpdateInstalled, root: JournalRoot, elsewhere: Elsewhere, sessions: ReadSessions, providers: Providers, clock: Clock, settings: Settings) -> list[Fact]:
        Tidy(root, elsewhere, sessions, providers, clock).files(settings.days)
        return []
