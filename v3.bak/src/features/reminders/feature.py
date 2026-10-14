from framework.base import Feature
from framework.journal import Journal
from controllers.types import Reminders
from expects import Given, Nudged, Reported, Told
from framework.recital import WORKING, register_recital
from events.reminders import ReminderMentioned, RemindersStanding
from features.reminders.details import RemindersDetails

FIRST = Reminders.resource(n=1, title="run the suites first")
SECOND = Reminders.resource(n=2, title="say which environment")
ON_WORKED = {"triggers.reminders": {"on": "worked"}}
EVERY_2_USES = {"triggers.reminders": {"every": 2, "unit": "uses"}}
EVERY_10_PERCENT = {"triggers.reminders": {"every": 10, "unit": "percent"}}
AT_START = {"triggers.reminders": {"unit": "start"}}
SWITCHED_OFF = {"features.reminders": False}
TOOL_USES = tuple(Reported("working", "PreToolUse") for _ in range(3))
CONTEXT_MARKS = tuple(Reported("working", "PostToolUse", context=at) for at in (3, 9.9, 10, 14, 19, 20.5))
AFTER_WORK = (Reported("working", "PreToolUse"), Reported("idle", "Stop"), Reported("idle", "Stop"), Reported("working", "UserPromptSubmit"), Reported("idle", "Stop"), Reported("working", "PreToolUse"))


class RemindersFeature(Feature):
    details = RemindersDetails

    def register(self, journal: Journal) -> None:
        register_recital(journal, Reminders, ReminderMentioned, RemindersStanding, cadence=(
            Given(Reported("idle", "Stop"), rows=(WORKING, FIRST, SECOND), settings=ON_WORKED, earlier=AFTER_WORK)
                >> Told("standing", times=2, to="claude-1") & Nudged("standing", rows="1. run the suites first; 2. say which environment"),
            Given(Reported("idle", "Stop"), rows=(WORKING, SECOND), settings=ON_WORKED, earlier=AFTER_WORK) >> Nudged("standing", rows="2. say which environment"),
            Given(Reported("working", "PreToolUse"), rows=(WORKING, FIRST), settings=EVERY_2_USES, earlier=TOOL_USES)
                >> Told("standing", times=2) & Nudged("standing", rows="1. run the suites first"),
            Given(Reported("idle", "Stop"), rows=(WORKING, FIRST), settings=EVERY_2_USES, earlier=TOOL_USES + (Reported("working", "PreToolUse"),)) >> Told("standing", times=2),
            Given(Reported("working", "PostToolUse", context=41), rows=(WORKING, FIRST), settings=EVERY_10_PERCENT, earlier=CONTEXT_MARKS) >> Told("standing", times=3),
            Given(Reported("idle", "Stop"), rows=(WORKING, FIRST), settings=SWITCHED_OFF, earlier=AFTER_WORK) >> Told("standing", times=0),
            Given(Reported("idle", "Stop"), rows=(WORKING, FIRST), earlier=AFTER_WORK + (Reported("working", "PostToolUse", context=26),)) >> Told("standing", times=0),
            Given(Reported("idle", "SessionStart"), rows=(WORKING, FIRST), settings=AT_START) >> Nudged("standing", rows="1. run the suites first"),
        ))
