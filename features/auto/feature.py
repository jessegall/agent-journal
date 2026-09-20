from controllers.types import Works
from features import trigger
from features.base import Feature, event, interceptor
from features.auto.next import next
from features.auto.policy import refusal


class Auto(Feature):
    name = "auto"
    title_ = "Auto mode"
    abstract_ = "The next ready row, by priority, offered on idle while nothing is open"
    help_ = "Off by default: enabling it is the user's word to work the list and decide without blocking questions. Five minutes quiet with unparked work open earns a direct question — are you still working? — and parked work is skipped by that and by the next-row offer alike. A row is ready when it is not blocked, waits on no open row or question, and its plan's phase is current. Questions only the user can answer go through the journal so work can continue."
    trigger = {"on": trigger.IDLE}
    default = False

    @interceptor
    def no_blocking_question(self, provider, record, hook, session) -> str:
        return refusal(provider, hook)

    @event("agent.updated")
    def offer(self, event, record) -> None:
        agent = self.agent_due(event, record)
        if not agent:
            return
        if [w for w in self.standing(record, Works) if not w.parked]:
            return
        row = next(record)
        if row:
            self.nudge(record, agent, f"todo {row.n} next")
