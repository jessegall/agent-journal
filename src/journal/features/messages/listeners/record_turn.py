import re

from journal.events.agent.turn_written import TurnWritten
from journal.features.agent_listener import AgentListener
from journal.features.messages.faces import Faces
from journal.models.actor import Actor
from journal.models.author import Author
from journal.models.message import Message
from journal.providers.providers import Providers
from journal.repositories.entries import Entries
from journal.repositories.messages import Messages
from journal.repositories.not_found import NotFound
from journal.supervisor_link import SupervisorLink

REPLY_TAG = re.compile(r"^[ \t]*(?:>\s?)?(?:\*\*)?\[!reply:(\d+(?:,\d+)*)\](?:\*\*)?[ \t]*", re.MULTILINE)
"""The reply tag opens a line of the turn, as every tag does; one anywhere else is text."""
STRAY_TAG = re.compile(r"\[!reply:(\d+)\]")
JOURNAL_LINE = "[journal]"


class RecordTurn(AgentListener[TurnWritten]):
    """Every whole turn the agent writes for the user becomes a message in the chat. A [!reply:N] tag opening a line makes it the answer to message N (N,M answers both) and marks them read; a tag elsewhere is text, and the agent is told so. A turn that is only a face is not posted: the agent is told to react. A turn that only answered a journal line and changed nothing is kept as an acknowledgement, out of the chat."""

    def __init__(self, messages: Messages, entries: Entries, providers: Providers, supervisor: SupervisorLink) -> None:
        self.messages, self.entries, self.providers, self.supervisor = messages, entries, providers, supervisor

    def handle(self, event: TurnWritten) -> None:
        from journal.features.messages.feature import Messages as MessagesFeature
        if not event.final or not event.text.strip():
            return
        if Faces.only_face(event.text):
            self.supervisor.type(MessagesFeature.ONLY_A_FACE.about(face=event.text.strip()).rendered())
            return
        self._record(event, event.text)

    def _record(self, event: TurnWritten, whole: str) -> None:
        by = Actor.agent(event.session)
        answered = [int(n) for tag in REPLY_TAG.finditer(whole) for n in tag.group(1).split(",")]
        text = REPLY_TAG.sub("", whole).strip()
        acknowledgement = not answered and self._answers_a_journal_line(event)
        self.messages.save(Message(environment_id=event.environment_id, author=Author.AGENT, text=text, reply_to=answered[0] if answered else None, acknowledgement=acknowledgement), by)
        for n in answered:
            self._mark_read(n, by)
        stray = STRAY_TAG.search(text)
        if stray:
            self.supervisor.type(f"the [!reply:{stray.group(1)}] tag must open a line of your turn; message {stray.group(1)} is still unanswered")

    def _answers_a_journal_line(self, event: TurnWritten) -> bool:
        """The turn's prompt was a line the journal typed, and no file changed since: nothing in it is news for the user."""
        prompts = [e for e in self.entries.of_kind(event.environment_id, "PromptSubmitted") if e.actor and e.actor.id == event.session]
        if not prompts or not prompts[-1].data.get("prompt", "").startswith(JOURNAL_LINE):
            return False
        provider = self.providers.named(event.provider)
        since = self.entries.since(event.environment_id, prompts[-1].id)
        return not any(e.kind == "ToolStarting" and provider.writes(e.data.get("tool_name", "")) for e in since)

    def _mark_read(self, n: int, by: Actor) -> None:
        try:
            self.messages.mark_read(self.messages.find(n), by)
        except NotFound:
            return
