import re

from controllers.types import Nudges
from engine.events.engine import AgentMessageSending
from features.command_tags.reading import CARRIED
from features.parts import AgentContext, Handler
from providers.base import JOURNAL
from resources.base import AGENT, SYSTEM, Refused, titled

BARE = re.compile(r"^\W*(?:ok(?:ay)?|noted|understood|got it|acknowledged|will do|on it|done|carrying on|continuing|still waiting|waiting)\b", re.I)
MOST_WORDS = 12
ALWAYS_KEPT = ("message", "question", "comment")


def bare(text: str) -> bool:
    words = text.split()
    return not words or (len(words) <= MOST_WORDS and "?" not in text and bool(BARE.match(text)))


def reply_kept(record, handed: list[str]) -> bool:
    if not handed or any(ref.partition(":")[0] in ALWAYS_KEPT for ref in handed):
        return True
    nudges = Nudges(record, actor=SYSTEM)
    try:
        return any(nudges.load(int(ref.partition(":")[2])).data.get("reply_kept") for ref in handed if ref.startswith("nudge:"))
    except Refused:
        return True


class HideBareAcknowledgements(Handler):
    def handle(self, context: AgentContext, event: AgentMessageSending) -> None:
        row, text = context.agent.row, event.text.strip()
        if event.data.get("stopped") or CARRIED.search(text) or row.prompted != JOURNAL or row.failure:
            return
        if not bare(text) or reply_kept(context.record, row.handed):
            return
        event.stop()
        if text and context.once("acknowledged", text):
            context.journal.acting(AGENT).messages.create(titled(text), brief=text, acknowledgement=True)
