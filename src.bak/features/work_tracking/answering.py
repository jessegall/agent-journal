from events.answers import Allowed, Answer, Refused
from events.asking import ToolCallAsked
from features.work_tracking.waiting import WAIT_WAY, only_waits
from receiving import Answerer
from serving import Holds


class RefuseHeldCalls(Answerer[ToolCallAsked]):
    def answer(self, event: ToolCallAsked, holds: Holds) -> Answer:
        why = holds.why(event.subagent, event.writes)
        return Refused(why) if why else Allowed()


class RefuseWaitingInTheShell(Answerer[ToolCallAsked]):
    def answer(self, event: ToolCallAsked) -> Answer:
        waiting = bool(event.command) and not event.subagent and not event.background and only_waits(event.command)
        return Refused(WAIT_WAY) if waiting else Allowed()
