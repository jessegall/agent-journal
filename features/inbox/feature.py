from controllers.types import CONTROLLERS
from features import trigger
from features.base import Feature, on
from resources.base import AGENT, SYSTEM


class Inbox(Feature):
    name = "inbox"
    title_ = "The inbox"
    abstract_ = "Unread messages are named after a tool use, again and again, and past a patience they hold the agent's writes"
    help_ = "journal message unread lists them; reading each one marks it read and lifts the hold. triggers.inbox sets how often, settings inbox.patience how many times before the hold."
    trigger = {"every": 1, "unit": trigger.USES}
    patience = 5

    def unread(self, record) -> list:
        return CONTROLLERS["message"](record, actor=SYSTEM).unread(AGENT)

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
        self.nudge(record, agent, "there are new messages in your inbox", "journal message unread, then journal message read <n> for each")
        if count > record.setting("inbox", {}).get("patience", self.patience):
            self.hold(record, "your inbox is unread: journal message unread, then journal message read <n> for each, before any other write")
