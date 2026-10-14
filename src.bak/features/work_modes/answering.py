from events.answers import Allowed, Answer, Refused
from events.asking import ToolCallAsked
from engine.journal_calls import calls
from features.work_modes.details import SOLO
from features.work_modes.modes import kept_mode
from receiving import Answerer
from serving import Settings

REFUSED = "the user set this environment to solo: do the writing yourself; only a subagent that reads, such as Explore or Plan, may be dispatched, and no helper"


class RefuseHelperInSolo(Answerer[ToolCallAsked]):
    def answer(self, event: ToolCallAsked, settings: Settings) -> Answer:
        solo = kept_mode(settings.mode) == SOLO and not event.subagent and event.command
        return Refused(REFUSED) if solo and any(made.names("helper", "dispatch") for made in calls(event.command)) else Allowed()
