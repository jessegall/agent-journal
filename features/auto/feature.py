from features import trigger
from features.base import Feature, on
from features.auto.next import next


class Auto(Feature):
    name = "auto"
    title_ = "Auto mode"
    abstract_ = "The next ready row, by priority, offered on idle while nothing is open"
    help_ = "Off by default: enabling it is the user's word to work the list. A row is ready when it is not blocked, waits on no open row or question, and its plan's phase is current."
    trigger = {"on": trigger.IDLE}
    default = False

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
