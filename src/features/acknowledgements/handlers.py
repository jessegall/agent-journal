import re

from controllers.types import Nudges
from engine.events.engine import AgentMessageSending
from features.command_tags.reading import CARRIED
from features.messages.answering import NODS
from features.parts import AgentContext, Handler
from providers.base import JOURNAL
from resources.base import AGENT, SYSTEM, Refused, titled

NOD = rf"(?:{NODS}|noted|understood|acknowledged|will do|on it|done|carrying on|continuing|still waiting|waiting|sir(?: jesse)?)"
BARE = re.compile(rf"^\W*{NOD}(?:[\s,.;:!-]+{NOD})*\W*$", re.I)
ALWAYS_KEPT = ("message", "question", "comment")


def bare(text: str) -> bool:
    return not text.split() or bool(BARE.match(text))


def reply_kept(record, delivered: list[str]) -> bool:
    if not delivered or any(ref.partition(":")[0] in ALWAYS_KEPT for ref in delivered):
        return True
    nudges = Nudges(record, actor=SYSTEM)
    try:
        return any(nudges.load(int(ref.partition(":")[2])).data.get("reply_kept") for ref in delivered if ref.startswith("nudge:"))
    except Refused:
        return True


class HideBareAcknowledgements(Handler):
    def handle(self, context: AgentContext, event: AgentMessageSending) -> None:
        row, text = context.agent.row, event.text.strip()
        if event.data.get("stopped") or CARRIED.search(text) or row.prompted != JOURNAL or row.failure:
            return
        if not bare(text) or reply_kept(context.record, row.delivered):
            return
        event.stop()
        if text and context.once("acknowledged", f"{','.join(row.delivered)}:{text}"):
            context.journal.acting(AGENT).messages.create(titled(text), brief=text, acknowledgement=True)
