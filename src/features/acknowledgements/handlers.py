import re

from controllers.base import row_of
from controllers.types import Messages, Nudges
from engine.events.engine import AgentMessageSending
from features.command_tags.reading import CARRIED
from features.messages.answering import NODS
from features.parts import AgentContext, Handler
from providers.base import JOURNAL
from resources.base import AGENT, Ref, Refused, titled

NOD = rf"(?:{NODS}|noted|understood|acknowledged|will do|on it|done|carrying on|continuing|still waiting|waiting|sir(?: jesse)?)"
BARE = re.compile(rf"^\W*{NOD}(?:[\s,.;:!-]+{NOD})*\W*$", re.I)
ALWAYS_KEPT = ("message", "question", "comment")


def bare(text: str) -> bool:
    return not text.split() or bool(BARE.match(text))


def reply_kept(record, delivered: list[str]) -> bool:
    try:
        refs = [Ref.parse(ref) for ref in delivered]
        if not refs or any(ref.type in ALWAYS_KEPT for ref in refs):
            return True
        return any(row_of(record, ref).data.get("reply_kept") for ref in refs if ref.type == Nudges.resource.type)
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
            context.journal.acting(AGENT).get(Messages).create(titled(text), brief=text, acknowledgement=True)
