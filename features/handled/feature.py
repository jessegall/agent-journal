from controllers.types import Messages
from features.base import Feature, on
from resources.base import SECTION, SYSTEM


class Handled(Feature):
    name = "handled"
    title_ = "Handled messages close"
    abstract_ = "A message whose every paragraph has been processed into a part is closed, naming what each part became"
    help_ = "Process each part with journal message process <n> \"<their words>\" \"<resource ref>\"; once every paragraph is covered the message closes itself. A message with parts left stays open."

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
