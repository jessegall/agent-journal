from controllers.base import row_of
from controllers.types import Messages, Nudges
from engine.events.engine import AgentMessageSending
from features.command_tags.reading import CARRIED
from features.parts import AgentContext, Handler
from providers.base import JOURNAL
from features.acknowledgements.details import KEPT_OUT
from resources.base import AGENT, USER, Ref, Refused, titled

ALWAYS_KEPT = ("message", "question", "comment")


def reply_kept(record, delivered: list[str]) -> bool:
    try:
        refs = [Ref.parse(ref) for ref in delivered]
        if not refs or any(ref.type in ALWAYS_KEPT and written_by_person(record, ref) for ref in refs):
            return True
        return any(row_of(record, ref).data.get("reply_kept") for ref in refs if ref.type == Nudges.resource.type)
    except Refused:
        return True


def written_by_person(record, ref: Ref) -> bool:
    """A message the agent or another agent wrote, such as a helper's report, is a journal line to answer silently, not a message from the person."""
    return ref.type != Messages.resource.type or USER in row_of(record, ref).seen[:1]


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
        if context.once("kept out", "told"):
            context.agent.whisper(KEPT_OUT)
        if text and context.once("acknowledged", f"{','.join(row.delivered)}:{text}"):
            context.journal.acting(AGENT).get(Messages).create(titled(text), brief=text, acknowledgement=True)
