from controllers.base import row_of
from controllers.types import Messages, Nudges
from engine.events.engine import AgentMessageSending
from features.command_tags.reading import CARRIED
from features.parts import AgentContext, Handler
from providers.base import JOURNAL
from resources.base import AGENT, Ref, Refused, titled

ALWAYS_KEPT = ("message", "question", "comment")


def reply_kept(record, delivered: list[str]) -> bool:
    try:
        refs = [Ref.parse(ref) for ref in delivered]
        if not refs or any(ref.type in ALWAYS_KEPT for ref in refs):
            return True
        return any(row_of(record, ref).data.get("reply_kept") for ref in refs if ref.type == Nudges.resource.type)
    except Refused:
        return True


def tells_something(row, text: str) -> bool:
    return bool(row.failure or row.turn_wrote or "?" in text or CARRIED.search(text))


class HideJournalOnlyTurns(Handler):
    def handle(self, context: AgentContext, event: AgentMessageSending) -> None:
        row, text = context.agent.row, event.text.strip()
        if event.data.get("stopped") or row.prompted != JOURNAL or tells_something(row, text):
            return
        if reply_kept(context.record, row.delivered):
            return
        event.stop()
        if text and context.once("acknowledged", f"{','.join(row.delivered)}:{text}"):
            context.journal.acting(AGENT).get(Messages).create(titled(text), brief=text, acknowledgement=True)
