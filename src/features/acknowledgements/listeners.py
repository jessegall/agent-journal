from events import Fact
from events.acknowledgements import FirstNodWithheld, NodWithheld
from events.agents import AgentTurnWritten
from events.answers import Allowed, Answer, Kept
from events.asking import AgentMessageSending
from resources.tags import CARRIED
from payload import JOURNAL
from receiving import Answerer, Listener
from resources.base import USER, Ref, Refused
from resources.types import AgentRow, Message, Nudge
from serving import ReadRows

ALWAYS_KEPT = ("message", "question", "comment")
A_NOD = 120


def a_nod(row, text: str, messages, nudges) -> bool:
    """Whether a turn only acknowledged the journal lines that prompted it: one that tells the user something, or answers a line whose answer must be read, is not."""
    return row.prompted == JOURNAL and not tells_something(row, text) and not reply_kept(row.delivered, messages, nudges)


def tells_something(row, text: str) -> bool:
    """Judged by what the turn says, never by what prompted it: a failure, work that landed, a question, a tag and anything longer than a nod are written to the user."""
    return bool(row.failure or row.turn_wrote or "?" in text or CARRIED.search(text)) or len(text) > A_NOD


def reply_kept(delivered: list[str], messages, nudges) -> bool:
    try:
        refs = [Ref.parse(ref) for ref in delivered]
        if not refs or any(ref.type in ALWAYS_KEPT and awaiting_person(ref, messages) for ref in refs):
            return True
        return any(nudges.load(ref.n).data.get("reply_kept") for ref in refs if ref.type == Nudge.type)
    except Refused:
        return True


def awaiting_person(ref: Ref, messages) -> bool:
    """A message, question or comment from the person that nothing has answered yet. A message the agent or a helper wrote is a journal line to answer silently; one from another session is a peer's words."""
    if ref.type != Message.type:
        return True
    message = messages.load(ref.n)
    return (USER in message.seen[:1] or bool(message.data.get("from_session"))) and not messages.is_answered(message)


class KeepNodsOutOfTheChat(Answerer[AgentMessageSending]):
    def answer(self, event: AgentMessageSending, agents: ReadRows[AgentRow], messages: ReadRows[Message], nudges: ReadRows[Nudge]) -> Answer:
        return Kept() if a_nod(agents.peek_session(event.session), event.text.strip(), messages, nudges) else Allowed()


class SpotNods(Listener[AgentTurnWritten]):
    def listen(self, event: AgentTurnWritten, agents: ReadRows[AgentRow], messages: ReadRows[Message], nudges: ReadRows[Nudge]) -> list[Fact]:
        row, text = agents.peek(event.agent), event.text.strip()
        if not text or not a_nod(row, text, messages, nudges):
            return []
        return [FirstNodWithheld(agent=event.agent).once(f"kept out|{row.title}"),
                NodWithheld(agent=event.agent, turn=event.turn, text=text).once(f"{','.join(row.delivered)}:{text}")]
