from events.agents import ClockTicked
from events.notifications import NotificationCreated
from events.runtime_cleanup import UpdateInstalled
from expects import WHEN, Dispatches, File, Given, Removed, Wrote, answering, at, nothing
from features.auto_update.announcing import KIND
from framework.base import Feature
from features.runtime_cleanup.details import RuntimeCleanupDetails
from features.runtime_cleanup.handlers import TidyAfterUpdate, TidyRuntime
from features.runtime_cleanup.listeners import SpotUpdateAnnounced
from framework.journal import Journal
from resources.base import SYSTEM
from resources.types import AgentRow, Notification

QUIET_SESSION = ".journal/runtime/sessions/claude-9/screen"
LEFT_OVER = answering({QUIET_SESSION: "what the agent last showed"})
LONG_AFTER = at(2 * WHEN)
AGENT_ROW = AgentRow(n=1, title="claude-1")
ANNOUNCED = NotificationCreated(n=1, type="notification", action="created", actor=SYSTEM)


class RuntimeCleanup(Feature):
    details = RuntimeCleanupDetails

    def register(self, journal: Journal) -> None:
        journal.events.handle(ClockTicked, TidyRuntime(), expects=[
            Given(ClockTicked(agent=1), rows=[AGENT_ROW], files=LEFT_OVER, clock=LONG_AFTER) >> Removed(File(QUIET_SESSION)),
            Given(ClockTicked(agent=1), rows=[AGENT_ROW], files=LEFT_OVER) >> Wrote(File(QUIET_SESSION, "what the agent last showed")),
        ], after=("ExpireOldRows",))
        journal.events.listen(NotificationCreated, SpotUpdateAnnounced(), expects=[
            Given(ANNOUNCED, rows=[Notification(n=1, title="Updated to a new version", data={"kind": KIND})]) >> Dispatches(UpdateInstalled(notification=1)),
            Given(ANNOUNCED, rows=[Notification(n=1, title="Something finished", data={"kind": "other"})]) >> Dispatches(nothing),
        ])
        journal.events.handle(UpdateInstalled, TidyAfterUpdate(), expects=[
            Given(UpdateInstalled(notification=1), rows=[Notification(n=1, title="Updated to a new version", data={"kind": KIND})], files=LEFT_OVER, clock=LONG_AFTER) >> Removed(File(QUIET_SESSION)),
            Given(UpdateInstalled(notification=1), rows=[Notification(n=1, title="Updated to a new version", data={"kind": KIND})], files=LEFT_OVER) >> Wrote(File(QUIET_SESSION, "what the agent last showed")),
        ])
