from controllers.types import Agents, Comments, Messages, Reactions
from features import trigger
from features.base import Feature, on
from resources.base import AGENT, SYSTEM


class Status(Feature):
    name = "status"
    title_ = "A status update owed"
    abstract_ = "A message read and not answered for ten tool uses earns a private nudge to give the user a status update; at twenty the writes wait for a reply"
    help_ = "triggers.status sets the cadence (every 10 uses); status.patience (2) is how many nudges go unheeded before the hold. A reply, a reaction or processing the message settles it."
    trigger = {"every": 10, "unit": trigger.USES}
    patience = 2

    def in_hand(self, record):
        messages = Messages(record, actor=SYSTEM)
        return [m for m in messages.all() if AGENT in m.seen and not m.completed and m.seen[:1] != [AGENT] and not self.answered(record, m)]

    def answered(self, record, message) -> bool:
        replies = Comments(record, actor=SYSTEM).linked_to(message.ref)
        faces = Reactions(record, actor=SYSTEM).linked_to(message.ref)
        return any(r.seen[:1] == [AGENT] for r in replies + faces)

    @on("message.created")
    def arrived(self, event, record) -> None:
        for agent in Agents(record, actor=SYSTEM).all():
            trigger.write(record, agent, self.name, uses=int(agent.data.get("uses") or 0), count=0)

    @on("agent.updated")
    def owed(self, event, record) -> None:
        agent = self.agent(event, record)
        held = self.in_hand(record)
        if not held:
            self.release(record)
            trigger.write(record, agent, self.name, count=0)
            return
        if not self.due(record, agent):
            return
        count = int(trigger.last(record, agent.title, self.name).get("count") or 0) + 1
        trigger.write(record, agent, self.name, count=count)
        names = ", ".join(f"message {m.n}" for m in held[-3:])
        self.nudge(record, agent, f"give the user a status update on {names}", "read and unanswered for a while: journal message reply <n> \"<where it stands>\", a reaction, or journal message processed <n>", private=True)
        if count > record.setting("status", {}).get("patience", self.patience):
            self.hold(record, f"the user waits on a status update for {names}: reply, react or process before any other write")
