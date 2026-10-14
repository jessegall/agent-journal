from events.agents import ClockTicked
from events.notifications import NotificationCreated
from events.runtime_cleanup import RuntimeTidyDue, UpdateInstalled
from expects import WHEN, Dispatches, File, Given, Ran, Removed, Wrote, answering, at, nothing
from resources.types import UPDATE
from framework.base import Feature
from framework.due import DueOnClock
from features.runtime_cleanup.details import RuntimeCleanupDetails
from features.runtime_cleanup.handlers import TidyAfterUpdate, TidyRuntime
from features.runtime_cleanup.listeners import SpotUpdateAnnounced
from framework.journal import Journal
from features.runtime_cleanup.tidy import SESSIONS
from resources.base import SYSTEM
from resources.files import RUNTIME
from resources.types import AgentRow, Notification

CAPTURE = f".journal/{RUNTIME}/sessions/codex-1/printed"
COMMANDS_LOG = f".journal/{RUNTIME}/commands.log"
QUIET_SESSION = ".journal/runtime/sessions/claude-9/screen"
LEFT_OVER = answering({QUIET_SESSION: "what the agent last showed"})
LONG_AFTER = at(2 * WHEN)
AGENT_ROW = AgentRow(n=1, title="claude-1")
DAY = 86400
SESSION = f"{SESSIONS}/claude-9"
LAUNCH = f"{RUNTIME}/launches/a.log"
STAGED = "plugins/.staging-x"
ARCHIVE = "attic/old.tar.gz"
OUTPUT = f"{RUNTIME}/outputs/output-1"
ANNOUNCED = NotificationCreated(n=1, type="notification", action="created", actor=SYSTEM)


class RuntimeCleanup(Feature):
    details = RuntimeCleanupDetails

    def register(self, journal: Journal) -> None:
        journal.events.listen(ClockTicked, DueOnClock(RuntimeTidyDue), expects=[
            Given(ClockTicked(agent=1)) >> Dispatches(RuntimeTidyDue(agent=1).due()),
        ])
        journal.events.handle(RuntimeTidyDue, TidyRuntime(), expects=[
            Given(RuntimeTidyDue(agent=1), rows=[AGENT_ROW], files=LEFT_OVER, clock=LONG_AFTER) >> Removed(File(QUIET_SESSION)),
            Given(RuntimeTidyDue(agent=1), rows=[AGENT_ROW], files=LEFT_OVER) >> Wrote(File(QUIET_SESSION, "what the agent last showed")),
            Given(RuntimeTidyDue(agent=1), rows=[AGENT_ROW], files=answering({CAPTURE: "old" * 100_000 + "THE END"})) >> Wrote(File(CAPTURE, "THE END", size=64 * 1024)),
            Given(RuntimeTidyDue(agent=1), rows=[AGENT_ROW], files=answering({CAPTURE: "short"})) >> Wrote(File(CAPTURE, "short", size=5)),
            Given(RuntimeTidyDue(agent=1), rows=[AGENT_ROW], files=answering({COMMANDS_LOG: "x" * (2 * 1024 * 1024) + "last line\n"})) >> Wrote(File(COMMANDS_LOG, "last line", size=1024 * 1024)),
            Given(RuntimeTidyDue(agent=1), rows=[AGENT_ROW],
                  journal_root=answering({("is dir", RUNTIME): True, ("glob", f"{SESSIONS}/*"): [SESSION], ("is dir", SESSION): True,
                                          ("glob", f"{SESSION}/*"): [f"{SESSION}/screen"], ("modified", f"{SESSION}/screen"): WHEN - 3 * DAY})) >> Ran(("remove", SESSION)),
            Given(RuntimeTidyDue(agent=1), rows=[AGENT_ROW], journal_root=answering({("is dir", RUNTIME): True, ("glob", f"{RUNTIME}/launches/*.log"): [LAUNCH], ("modified", LAUNCH): WHEN - 3 * DAY}))
                >> Ran(("remove", LAUNCH)),
            Given(RuntimeTidyDue(agent=1), rows=[AGENT_ROW], journal_root=answering({("glob", "plugins/.staging-*"): [STAGED], ("is dir", STAGED): True, ("modified", STAGED): WHEN - 7200}))
                >> Ran(("remove", STAGED)),
            Given(RuntimeTidyDue(agent=1), rows=[AGENT_ROW], journal_root=answering({("glob", "attic/*.tar.gz"): [ARCHIVE], ("modified", ARCHIVE): WHEN - 100 * DAY})) >> Ran(("remove", ARCHIVE)),
            Given(RuntimeTidyDue(agent=1), rows=[AGENT_ROW], journal_root=answering({("glob", f"{RUNTIME}/outputs/output-*"): [OUTPUT], ("modified", OUTPUT): WHEN - 2 * DAY})) >> Ran(("remove", OUTPUT)),
        ])
        journal.events.listen(NotificationCreated, SpotUpdateAnnounced(), expects=[
            Given(ANNOUNCED, rows=[Notification(n=1, title="Updated to a new version", data={"kind": UPDATE})]) >> Dispatches(UpdateInstalled(notification=1)),
            Given(ANNOUNCED, rows=[Notification(n=1, title="Something finished", data={"kind": "other"})]) >> Dispatches(nothing),
        ])
        journal.events.handle(UpdateInstalled, TidyAfterUpdate(), expects=[
            Given(UpdateInstalled(notification=1), rows=[Notification(n=1, title="Updated to a new version", data={"kind": UPDATE})], files=LEFT_OVER, clock=LONG_AFTER) >> Removed(File(QUIET_SESSION)),
            Given(UpdateInstalled(notification=1), rows=[Notification(n=1, title="Updated to a new version", data={"kind": UPDATE})], files=LEFT_OVER) >> Wrote(File(QUIET_SESSION, "what the agent last showed")),
            Given(UpdateInstalled(notification=1), rows=[Notification(n=1, title="Updated to a new version", data={"kind": UPDATE})],
                  journal_root=answering({("glob", "plugins/.staging-*"): [STAGED], ("is dir", STAGED): True, ("modified", STAGED): WHEN - 7200})) >> Ran(("remove", STAGED)),
        ])
