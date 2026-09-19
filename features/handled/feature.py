from controllers.types import CONTROLLERS, Messages
from features.base import Feature, on
from resources.base import AGENT, SECTION, SYSTEM


class Handled(Feature):
    name = "handled"
    title_ = "Handled messages close"
    abstract_ = "A message is closed once the agent replies to it, reacts to it, or processes every paragraph into a part"
    help_ = "A reply or a reaction by the agent answers the user's message and closes it; so does processing each part with journal message process <n> \"<their words>\" \"<resource ref>\" until every paragraph is covered."
    ANSWERS = {"comment": "answered", "reaction": "acknowledged"}

    def paragraphs(self, message) -> list[str]:
        blocks = (b.strip() for b in (message.brief or message.title).split("\n\n"))
        return [b for b in blocks if b and not b.startswith(">")]

    def covered(self, message) -> bool:
        parts = [s[SECTION.title] for s in message.sections]
        paragraphs = self.paragraphs(message)
        return bool(paragraphs) and all(any(p in block or block in p for p in parts) for block in paragraphs)

    @on("message.updated")
    def processed(self, event, record) -> None:
        if not event.data.get("section"):
            return
        messages = Messages(record, actor=SYSTEM)
        message = messages.load(event.n)
        if message.completed or not self.covered(message):
            return
        became = ", ".join(s[SECTION.body] for s in message.sections)
        messages.complete(message.n, how=f"every part became a record: {became}")

    @on("comment.created")
    @on("reaction.created")
    def answered(self, event, record) -> None:
        if event.actor != AGENT:
            return
        made = CONTROLLERS[event.type](record, actor=SYSTEM).load(event.n)
        messages = Messages(record, actor=SYSTEM)
        for ref in made.refs:
            kind, _, n = ref.partition(":")
            if kind != "message" or not n.isdigit():
                continue
            message = messages.load(int(n))
            if not message.completed and message.seen[:1] != [AGENT]:
                messages.complete(message.n, how=f"{self.ANSWERS[event.type]} by the agent")
