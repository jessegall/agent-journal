import re

from journal.events.agent.turn_written import TurnWritten
from journal.features.agent_listener import AgentListener
from journal.features.messages.faces import Faces
from journal.features.messages.tags import Tags
from journal.features.registry import Registry
from journal.models.actor import Actor
from journal.models.author import Author
from journal.models.link import Link
from journal.models.message import Message
from journal.models.ref import Ref
from journal.providers.providers import Providers
from journal.repositories.entries import Entries
from journal.repositories.links import Links
from journal.repositories.messages import Messages
from journal.repositories.not_found import NotFound
from journal.supervisor_link import SupervisorLink

REPLY_TAG = re.compile(r"^[ \t]*(?:>\s?)?(?:\*\*)?\[!reply:(\d+(?:,\d+)*)\](?:\*\*)?[ \t]*", re.MULTILINE)
"""The reply tag opens a line of the turn, as every tag does; one anywhere else is text."""
STRAY_TAG = re.compile(r"\[!reply:(\d+)\]")
JOURNAL_LINE = "[journal] "
SHORT = 240
"""An acknowledgement is a few words; a turn longer than this says something."""


class RecordTurn(AgentListener[TurnWritten]):
    """Every whole turn the agent writes for the user becomes a message in the chat, its tags taken out. A [!reply:N] tag opening a line makes it the answer to message N (N,M answers both) and marks them read; a tag elsewhere is text, and the agent is told so. A [!log:N] turn belongs to the task's log alone. A turn that is only a face is not posted: the agent is told to react. A turn that only answered a journal line and changed nothing is kept as an acknowledgement, out of the chat."""

    def __init__(self, messages: Messages, entries: Entries, providers: Providers, registry: Registry, supervisor: SupervisorLink, links: Links) -> None:
        self.messages, self.entries, self.providers, self.registry, self.supervisor, self.links = messages, entries, providers, registry, supervisor, links

    def handle(self, event: TurnWritten) -> None:
        from journal.features.messages.feature import Messages as MessagesFeature
        if not event.final or not event.text.strip():
            return
        if Faces.only_face(event.text):
            self.supervisor.type(event.environment_id, MessagesFeature.ONLY_A_FACE.about(face=event.text.strip()).rendered())
            return
        self._record(event, event.text)

    def _record(self, event: TurnWritten, whole: str) -> None:
        by = Actor.agent(event.session)
        for answered, part in self.sections(whole):
            text = Tags.visible(part)
            quiet = Tags.kept_out(part) and not answered
            acknowledgement = not answered and len(text) <= SHORT and "?" not in text and self._answers_a_journal_line(event)
            if text and not quiet:
                reply = self.messages.save(Message(environment_id=event.environment_id, author=Author.AGENT, text=text, reply_to=answered[0] if answered else None, acknowledgement=acknowledgement), by)
                for n in answered[1:]:
                    self._also_answers(reply, n, by)
            for n in answered:
                self._mark_read(n, by)
        stray = STRAY_TAG.search(Tags.visible(whole))
        if stray:
            self.supervisor.type(event.environment_id, f"the [!reply:{stray.group(1)}] tag must open a line of your turn; message {stray.group(1)} is still unanswered")

    @staticmethod
    def sections(whole: str) -> list[tuple[list[int], str]]:
        """One part per reply tag, the text after the tag up to the next one; what comes before the first tag belongs to the first part. A turn with one tag or none is one part."""
        tags = list(REPLY_TAG.finditer(whole))
        numbers = lambda tag: [int(n) for n in tag.group(1).split(",")]
        if len(tags) <= 1:
            return [([n for tag in tags for n in numbers(tag)], whole)]
        parts = []
        for i, tag in enumerate(tags):
            end = tags[i + 1].start() if i + 1 < len(tags) else len(whole)
            lead = whole[: tag.start()].strip() if i == 0 else ""
            rest = whole[tag.end():end].strip()
            parts.append((numbers(tag), f"{lead}\n\n{rest}" if lead else rest))
        return parts

    def _answers_a_journal_line(self, event: TurnWritten) -> bool:
        """The turn's prompt was a line the journal typed whose answer is not for the user, and no file changed since: nothing in it is news."""
        prompts = [e for e in self.entries.of_kind(event.environment_id, "PromptSubmitted") if e.actor and e.actor.id == event.session]
        prompt = prompts[-1].data.get("prompt", "") if prompts else ""
        if not prompt.startswith(JOURNAL_LINE) or self._answered_in_chat(event, prompt[len(JOURNAL_LINE):]):
            return False
        provider = self.providers.named(event.provider)
        since = self.entries.since(event.environment_id, prompts[-1].id)
        return not any(e.kind == "ToolStarting" and provider.writes(e.data.get("tool_name", ""), e.data.get("tool_input", {})) for e in since)

    def _answered_in_chat(self, event: TurnWritten, line: str) -> bool:
        """The nudge the typed line came from, when it is one whose answer belongs in the chat."""
        said = [e for e in self.entries.of_kind(event.environment_id, "nudge") if e.data.get("session") == event.session and e.data.get("line") == line]
        nudge = self.registry.nudge_keyed(said[-1].data["key"]) if said else None
        return bool(nudge and nudge.answered_in_chat)

    def _also_answers(self, reply: Message, n: int, by: Actor) -> None:
        """A reply naming several messages answers each: the first is what it replies to, the rest are linked."""
        try:
            self.links.save(Link(source=Ref.to(reply), target=Ref.to(self.messages.find(n)), kind=Messages.ANSWERS), by)
        except NotFound:
            return

    def _mark_read(self, n: int, by: Actor) -> None:
        try:
            self.messages.mark_read(self.messages.find(n), by)
        except NotFound:
            return
