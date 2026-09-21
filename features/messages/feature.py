import re

from controllers.types import Agents, CONTROLLERS, Messages
from features import trigger
from features.base import Behaviour, Feature, event, formats
from resources.base import AGENT, SECTION, SYSTEM, USER
from features.messages.answering import in_hand, theirs, unanswered
from engine.transcript import last_said

LINKED = ("message", "comment", "reaction", "nudge", "notification", "agent")
RUN_ON, SENTENCES = 400, 3
CODE = re.compile(r"(?<![`\w-])(?:journal(?:\s+[a-z_]+){1,2}|--[a-z][a-z-]*)(?![`\w])")
ANSWERS = {"comment": "answered", "reaction": "acknowledged"}


class MessagesFeature(Feature):
    name = "messages"
    aliases = (("inbox", "unread"), ("handled", "closing"), ("status", "answering"))
    title_ = "Messaging"
    abstract_ = "What the user leaves for the agent is named until it is read, answered before the work starts, and closed once it is dealt with"
    help_ = ("Unread messages are named at the first tool use after one arrives and every third after; five times ignored, the writes are held. "
             "A message that has been read is named again before the next write, a few times, and never refused over. "
             "A reply, a reaction, or processing every part closes it, and a message the agent wrote closes as soon as the user has seen it. "
             "Every row the agent files while a message is in its hands is linked to that message.")
    behaviours = {
        "unread": Behaviour("Name the unread messages", "Said at the first tool use after one arrives and every third after", trigger={"every": 3, "unit": trigger.USES}),
        "answering": Behaviour("Answer a message before writing", "Said before the next write while a message sits read and unanswered", trigger={"every": 1, "unit": trigger.USES}),
        "closing": Behaviour("Close a message once it is dealt with", "A reply, a reaction, every part processed, or the user reading what the agent wrote"),
        "linking": Behaviour("Link what is filed to the message in hand", "A row the agent creates while a message is open cites that message"),
        "paragraphs": Behaviour("Keep the paragraphs of a message apart", "A message of several sentences run together is named back once, at the end of the turn",
                                trigger={"on": trigger.IDLE}),
    }
    PATIENCE = "patience"
    patience = {"unread": 5, "answering": 3}

    def patient(self, record, key: str) -> int:
        return int(self.setting(record, f"{key}.{self.PATIENCE}", self.patience[key]))

    def counted(self, record, agent, key: str) -> int:
        count = int(trigger.last(record, agent.title, self.keyed(key)).get("count") or 0) + 1
        trigger.write(record, agent, self.keyed(key), count=count)
        return count

    @event("message.created")
    def arrived(self, event, record) -> None:
        for agent in self.live(record):
            trigger.write(record, agent, self.keyed("unread"), uses=int(agent.uses or 0) - self.behaviours["unread"].trigger["every"])
            trigger.write(record, agent, self.keyed("answering"), uses=int(agent.uses or 0), count=0)

    @event("agent.updated")
    def remind(self, event, record) -> None:
        agent = self.agent(event, record)
        if not any(AGENT not in row["seen"] and not row["completed"] and not row["deleted"] for row in Messages(record, actor=SYSTEM).summaries()):
            self.release(record, "unread")
            trigger.write(record, agent, self.keyed("unread"), count=0)
            return
        if not self.due(record, agent, "unread"):
            return
        self.nudge(record, agent, "there are new messages in your inbox", "journal message unread, then journal message read <n> for each", private=True)
        if self.counted(record, agent, "unread") > self.patient(record, "unread"):
            self.hold(record, "your inbox is unread: journal message unread, then journal message read <n> for each, before any other write", "unread")

    @event("agent.updated")
    def owed(self, event, record) -> None:
        agent = self.agent(event, record)
        held = unanswered(record)
        if not held:
            trigger.write(record, agent, self.keyed("answering"), count=0)
            return
        if not self.due(record, agent, "answering") or self.counted(record, agent, "answering") > self.patient(record, "answering"):
            return
        names = ", ".join(f"message {m.n}" for m in held[-3:])
        self.nudge(record, agent, f"answer {names} before you write anything", 'journal message reply <n> "<what you make of it>", a reaction, or journal message processed <n>', private=True)

    def paragraphs(self, message) -> list[str]:
        blocks = (b.strip() for b in (message.brief or message.title).split("\n\n"))
        return [b for b in blocks if b and not b.startswith(">")]

    def covered(self, message) -> bool:
        parts = [s[SECTION.title] for s in message.sections]
        paragraphs = self.paragraphs(message)
        return bool(paragraphs) and all(any(p in block or block in p for p in parts) for block in paragraphs)

    @event("message.updated")
    def processed(self, event, record) -> None:
        if not self.on(record, "closing") or not event.data.get("section"):
            return
        messages = Messages(record, actor=SYSTEM)
        message = messages.load(event.n)
        if message.completed or not self.covered(message):
            return
        became = ", ".join(s[SECTION.body] for s in message.sections)
        messages.complete(message.n, how=f"every part became a record: {became}")

    @event("message.updated")
    def seen(self, event, record) -> None:
        if not self.on(record, "closing"):
            return
        messages = Messages(record, actor=SYSTEM)
        message = messages.load(event.n)
        if message.completed or theirs(message) or USER not in message.seen:
            return
        messages.complete(message.n, how="read by the user")

    @event("comment.created")
    @event("reaction.created")
    def answered(self, event, record) -> None:
        if not self.on(record, "closing") or event.actor != AGENT:
            return
        made = CONTROLLERS[event.type](record, actor=SYSTEM).load(event.n)
        messages = Messages(record, actor=SYSTEM)
        for ref in made.refs:
            kind, _, n = ref.partition(":")
            if kind != "message" or not n.isdigit():
                continue
            message = messages.load(int(n))
            if not message.completed and theirs(message):
                messages.complete(message.n, how=f"{ANSWERS[event.type]} by the agent")

    @event("created")
    def link(self, event, record) -> None:
        if not self.on(record, "linking") or event.actor != AGENT or event.type in LINKED:
            return
        message = in_hand(record)
        if message and event.ref not in message.refs:
            Messages(record, actor=SYSTEM).link(message.n, event.ref)

    @formats
    def as_code(self, text, record):
        return "`".join(part if at % 2 else CODE.sub(lambda found: f"`{found.group(0)}`", part)
                        for at, part in enumerate(str(text or "").split("`")))

    @event("agent.updated")
    def spaced(self, event, record) -> None:
        agent = self.agent(event, record)
        if not agent or not self.due(record, agent, "paragraphs"):
            return
        said = last_said(record, agent).strip()
        if len(said) < RUN_ON or "\n\n" in said or said.count(". ") < SENTENCES:
            return
        self.nudge(record, agent, "your last message ran its paragraphs together",
                   "a blank line between parts is what makes a message readable: one thought to a paragraph", private=True)
