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
AFTER_WORK = (Reported("working", "PreToolUse"), Reported("idle", "Stop"), Reported("idle", "Stop"), Reported("working", "UserPromptSubmit"), Reported("idle", "Stop"), Reported("working", "PreToolUse"))


class RemindersFeature(Feature):
    details = RemindersDetails

    def register(self, journal: Journal) -> None:
        register_recital(journal, Reminders, ReminderMentioned, RemindersStanding, cadence=(
            Given(Reported("idle", "Stop"), rows=(WORKING, FIRST, SECOND), settings=ON_WORKED, earlier=AFTER_WORK)
                >> Told("standing", times=2, to="claude-1") & Nudged("standing", rows="1. run the suites first; 2. say which environment"),
            Given(Reported("idle", "Stop"), rows=(WORKING, SECOND), settings=ON_WORKED, earlier=AFTER_WORK) >> Nudged("standing", rows="2. say which environment"),
        ))
