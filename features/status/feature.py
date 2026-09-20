from controllers.types import Agents, Comments, Messages, Reactions
from features import trigger
from features.base import Feature, event
from resources.base import AGENT, SYSTEM


class Status(Feature):
    name = "status"
    PATIENCE = "patience"
    title_ = "Answering before writing"
    abstract_ = "A message the agent has read is answered before it writes anything: the user hears back before the work starts"
    help_ = "Said at the first tool use after a message is read and a few times more, then it lets the agent be; nothing is ever refused over it. A reply, a reaction or processing every part settles it. triggers.status sets how soon it is said (every tool use) and status.patience (3) how many times."
    trigger = {"every": 1, "unit": trigger.USES}
    patience = 3

    def in_hand(self, record):
        messages = Messages(record, actor=SYSTEM)
        return [m for m in messages.all() if AGENT in m.seen and not m.completed and m.seen[:1] != [AGENT] and not self.answered(record, m)]

    def answered(self, record, message) -> bool:
        replies = Comments(record, actor=SYSTEM).linked_to(message.ref)
        faces = Reactions(record, actor=SYSTEM).linked_to(message.ref)
        return any(r.seen[:1] == [AGENT] for r in replies + faces)

    @event("message.created")
    def arrived(self, event, record) -> None:
        for agent in Agents(record, actor=SYSTEM).all():
            trigger.write(record, agent, self.name, uses=int(agent.uses or 0), count=0)

    @event("agent.updated")
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
        if count > record.status.get(self.PATIENCE, self.patience):
            return
        names = ", ".join(f"message {m.n}" for m in held[-3:])
        self.nudge(record, agent, f"answer {names} before you write anything", "journal message reply <n> \"<what you make of it>\", a reaction, or journal message processed <n>", private=True)
