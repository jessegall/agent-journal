import re

from journal.events.agent.turn_written import TurnWritten
from journal.features.agent_listener import AgentListener
from journal.models.actor import Actor
from journal.models.author import Author
from journal.models.message import Message
from journal.repositories.messages import Messages
from journal.repositories.not_found import NotFound
from journal.supervisor_link import SupervisorLink

REPLY_TAG = re.compile(r"^[ \t]*(?:>\s?)?(?:\*\*)?\[!reply:(\d+(?:,\d+)*)\](?:\*\*)?[ \t]*", re.MULTILINE)
"""The reply tag opens a line of the turn, as every tag does; one anywhere else is text."""
STRAY_TAG = re.compile(r"\[!reply:(\d+)\]")


class RecordTurn(AgentListener[TurnWritten]):
    """Every turn the agent writes for the user becomes a message in the chat, gathered from the deltas it streams in; a [!reply:N] tag opening a line makes it the answer to message N (N,M answers both) and marks them read. A tag elsewhere is text, and the agent is told so."""

    def __init__(self, messages: Messages, supervisor: SupervisorLink) -> None:
        self.messages, self.supervisor = messages, supervisor
        self._gathering: dict[str, str] = {}

    def handle(self, event: TurnWritten) -> None:
        key = event.turn_id or event.session
        whole = self._gathering.get(key, "") + event.text
        if not event.final:
            self._gathering[key] = whole
            return
        self._gathering.pop(key, None)
        if whole.strip():
            self._record(event, whole)

    def _record(self, event: TurnWritten, whole: str) -> None:
        by = Actor.agent(event.session)
        answered = [int(n) for tag in REPLY_TAG.finditer(whole) for n in tag.group(1).split(",")]
        text = REPLY_TAG.sub("", whole).strip()
        self.messages.save(Message(environment_id=event.environment_id, author=Author.AGENT, text=text, reply_to=answered[0] if answered else None), by)
        for n in answered:
            self._mark_read(n, by)
        stray = STRAY_TAG.search(text)
        if stray:
            self.supervisor.type(f"the [!reply:{stray.group(1)}] tag must open a line of your turn; message {stray.group(1)} is still unanswered")

    def _mark_read(self, n: int, by: Actor) -> None:
        try:
            self.messages.mark_read(self.messages.find(n), by)
        except NotFound:
            return
