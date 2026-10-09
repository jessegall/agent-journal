from controllers.base import row_of
from controllers.types import Messages, Nudges
from engine.events.engine import AgentMessageSending
from features.command_tags.reading import CARRIED
from features.messages.answering import answered
from features.parts import AgentContext, Context, Handler
from providers.base import JOURNAL
from features.acknowledgements.details import KEPT_OUT
from resources.base import AGENT, USER, Ref, Refused, titled

ALWAYS_KEPT = ("message", "question", "comment")


def reply_kept(context: Context, delivered: list[str]) -> bool:
    try:
        refs = [Ref.parse(ref) for ref in delivered]
        if not refs or any(ref.type in ALWAYS_KEPT and awaiting_person(context, ref) for ref in refs):
            return True
        return any(row_of(context.record, ref).data.get("reply_kept") for ref in refs if ref.type == Nudges.resource.type)
    except Refused:
        return True


def written_by_person(record, ref: Ref) -> bool:
    """A message the agent or another agent wrote, such as a helper's report, is a journal line to answer silently, not a message from the person; one that came from another session is a peer's words and is always answered in the chat."""
    if ref.type != Messages.resource.type:
        return True
    message = row_of(record, ref)
    return USER in message.seen[:1] or bool(message.data.get("from_session"))


def awaiting_person(context: Context, ref: Ref) -> bool:
    """A message, question or comment from the person that nothing has answered yet; one the agent already reacted to or answered, handed over again by a journal line, asks for nothing."""
    if not written_by_person(context.record, ref):
        return False
    return ref.type != Messages.resource.type or not answered(context.journal, context.journal.get(Messages).load(ref.n))


def tells_something(row, text: str) -> bool:
    return bool(row.failure or row.turn_wrote or "?" in text or CARRIED.search(text))


class HideJournalOnlyTurns(Handler):
    def handle(self, context: AgentContext, event: AgentMessageSending) -> None:
        row, text = context.agent.row, event.text.strip()
        if event.data.get("stopped") or row.prompted != JOURNAL:
            return
        if tells_something(row, text) or reply_kept(context, row.delivered):
            if not context.once("sent turn", str(event.data.get("turn", ""))):
                event.stop()
            return
        event.stop()
        if context.once("kept out", "told"):
            context.agent.whisper(KEPT_OUT)
        if text and context.once("acknowledged", f"{','.join(row.delivered)}:{text}"):
            context.journal.acting(AGENT).get(Messages).create(titled(text), brief=text, acknowledgement=True)
