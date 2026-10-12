from engine.events.engine import ClockTicked
from events.resources import ResourceCreated
from expects import WHEN, File, Given, Removed, Unchanged, Wrote, answering, at
from features.auto_update.announcing import KIND
from features.base import Feature
from features.runtime_cleanup.details import RuntimeCleanupDetails
from features.runtime_cleanup.handlers import TidyAfterUpdate, TidyRuntime
from features.journal import Journal
from resources.base import SYSTEM
from resources.types import AgentRow, Notification

QUIET_SESSION = ".journal/runtime/sessions/claude-9/screen"
LEFT_OVER = answering({QUIET_SESSION: "what the agent last showed"})
LONG_AFTER = at(2 * WHEN)
AGENT_ROW = AgentRow(n=1, title="claude-1")


class RuntimeCleanup(Feature):
    details = RuntimeCleanupDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(TidyRuntime(), expects=[
            Given(ClockTicked(agent=1), rows=[AGENT_ROW], files=LEFT_OVER, clock=LONG_AFTER) >> Removed(File(QUIET_SESSION)),
            Given(ClockTicked(agent=1), rows=[AGENT_ROW], files=LEFT_OVER) >> Wrote(File(QUIET_SESSION, "what the agent last showed")),
        ])
        journal.events.handler(TidyAfterUpdate(), expects=[
            Given(ResourceCreated(n=1, type="notification", action="created", actor=SYSTEM), rows=[Notification(n=1, title="Updated to a new version", data={"kind": KIND})], files=LEFT_OVER, clock=LONG_AFTER)
                >> Removed(File(QUIET_SESSION)),
            Given(ResourceCreated(n=1, type="notification", action="created", actor=SYSTEM), rows=[Notification(n=1, title="Updated to a new version", data={"kind": KIND})], files=LEFT_OVER)
                >> Wrote(File(QUIET_SESSION, "what the agent last showed")),
            Given(ResourceCreated(n=1, type="notification", action="created", actor=SYSTEM), rows=[Notification(n=1, title="Something finished", data={"kind": "other"})]) >> Unchanged(),
        ])
