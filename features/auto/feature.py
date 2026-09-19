from features import trigger
from features.base import Feature, on, refuses
from features.auto.next import next
from features.auto.policy import refusal


class Auto(Feature):
    name = "auto"
    title_ = "Auto mode"
    abstract_ = "The next ready row, by priority, offered on idle while nothing is open"
    help_ = "Off by default: enabling it is the user's word to work the list and decide without blocking questions. A row is ready when it is not blocked, waits on no open row or question, and its plan's phase is current. Questions only the user can answer go through the journal so work can continue."
    trigger = {"on": trigger.IDLE}
    default = False

    @refuses
    def no_blocking_question(self, provider, record, hook, session) -> str:
        return refusal(hook)

    @on("agent.updated")
    def offer(self, event, record) -> None:
        agent = self.agent_due(event, record)
        if not agent:
            return
        if self.standing(record, "work"):
            return
        row = next(record)
        if row:
            self.nudge(record, agent, f"todo {row.n} next")
