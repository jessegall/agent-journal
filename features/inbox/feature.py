from controllers.types import Agents, Messages
from features import trigger
from features.base import Feature, on
from resources.base import AGENT, SYSTEM


class Inbox(Feature):
    name = "inbox"
    title_ = "The inbox"
    abstract_ = "Unread messages are named after a tool use, again and again, and past a patience they hold the agent's writes"
    help_ = "Said at the first tool use after a message arrives and every third after; five times ignored, the hold. triggers.inbox sets the cadence, inbox.patience the count."
    trigger = {"every": 3, "unit": trigger.USES}
    patience = 5

    def unread(self, record) -> list:
        return Messages(record, actor=SYSTEM).unread(AGENT)

    @on("message.created")
    def arrived(self, event, record) -> None:
        for agent in Agents(record, actor=SYSTEM).all():
            trigger.write(record, agent, self.name, uses=int(agent.data.get("uses") or 0) - self.trigger["every"])

    @on("agent.updated")
    def remind(self, event, record) -> None:
        agent = self.agent(event, record)
        if not self.unread(record):
            self.release(record)
            trigger.write(record, agent, self.name, count=0)
            return
        if not self.due(record, agent):
            return
        count = int(trigger.last(record, agent.title, self.name).get("count") or 0) + 1
        trigger.write(record, agent, self.name, count=count)
        self.nudge(record, agent, "there are new messages in your inbox", "journal message unread, then journal message read <n> for each", private=True)
        if count > record.setting("inbox", {}).get("patience", self.patience):
            self.hold(record, "your inbox is unread: journal message unread, then journal message read <n> for each, before any other write")
