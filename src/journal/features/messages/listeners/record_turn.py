import re
import threading

from journal.events.agent.turn_written import TurnWritten
from journal.events.agent_listener import AgentListener
from journal.features.messages.support.faces import Faces
from journal.features.messages.support.tags import Tags
from journal.features.messages.support.word_overlap import WordOverlap
from journal.features.registry import Registry
from journal.support.actor import Actor
from journal.models.author import Author
from journal.models.entry import Entry
from journal.models.link import Link
from journal.models.message import Message
from journal.support.ref import Ref
from journal.providers.providers import Providers
from journal.repositories.entries import Entries
from journal.repositories.links import Links
from journal.repositories.messages import Messages
from journal.support.not_found import NotFound
from journal.supervisor_link import SupervisorLink

REPLY_TAG = re.compile(r"^[ \t]*(?:>\s?)?(?:\*\*)?\[!reply:(\d+(?:,\d+)*)\](?:\*\*)?[ \t]*", re.MULTILINE)
"""The reply tag opens a line of the turn, as every tag does; one anywhere else is text."""
STRAY_TAG = re.compile(r"\[!reply:(\d+)\]")
JOURNAL_LINE = "[journal] "
SHORT = 240
"""An acknowledgement is a few words; a turn longer than this says something."""
REPEATS = 0.6
"""The share of closing words a reply sent in the same turn already holds, past which they say it again."""


class RecordTurn(AgentListener[TurnWritten]):
    """Every whole turn the agent writes for the user becomes a message in the chat, its tags taken out. A [!reply:N] tag opening a line makes it the answer to message N (N,M answers both) and marks them read; a tag elsewhere is text, and the agent is told so. A [!log:N] turn belongs to the task's log alone. A turn that is only a face is not posted: the agent is told to react. A turn that only answered a journal line and changed nothing is kept as an acknowledgement, out of the chat."""

    def __init__(self, messages: Messages, entries: Entries, providers: Providers, registry: Registry, supervisor: SupervisorLink, links: Links) -> None:
        self.messages, self.entries, self.providers, self.registry, self.supervisor, self.links = messages, entries, providers, registry, supervisor, links
        self.recording = threading.Lock()  # the same block arrives at once from the transcript and from the display hook

    def handle(self, event: TurnWritten) -> None:
        from journal.features.messages.feature import Messages as MessagesFeature
        if not event.final or not event.text.strip():
            return
        if Faces.only_face(event.text):
            self.supervisor.type(event.environment_id, MessagesFeature.ONLY_A_FACE.create(face=event.text.strip()).rendered())
            return
        with self.recording:
            self._record(event)

    def _record(self, event: TurnWritten) -> None:
        by, whole = Actor.agent(event.session), event.text
        for tagged, part in self.sections(whole):
            if self.already_recorded(part):
                continue
            text = Tags.visible(part)
            answered = self.unanswered_of(tagged, event)
            quiet = (Tags.kept_out(part) and not answered) or self.repeats_a_reply(text, tagged, event)
            acknowledgement = not answered and len(text) <= SHORT and "?" not in text and self._answers_a_journal_line(event)
            if text and not quiet:
                reply = self.messages.save(Message(author=Author.AGENT, text=text, reply_to=answered[0] if answered else None, acknowledgement=acknowledgement), by)
                for n in answered[1:]:
                    self._also_answers(reply, n, by)
            for n in answered:
                self._mark_read(n, by)
        for n in self.stray_owed(whole)[:1]:
            self.supervisor.type(event.environment_id, f"the [!reply:{n}] tag must open a line of your turn; message {n} is still unanswered")

    def unanswered_of(self, tagged: list[int], event: TurnWritten) -> list[int]:
        """The tagged messages the agent has not replied to yet; a tag on one already answered is refused once, so a reply goes out once."""
        from journal.features.messages.feature import Messages as MessagesFeature
        fresh = [n for n in tagged if self.earlier_reply(n) is None]
        if tagged and not fresh:
            said = MessagesFeature.REPLIED_ALREADY.create(n=tagged[0], reply=self.earlier_reply(tagged[0]).id)
            self.supervisor.type(event.environment_id, said.rendered())
        return fresh

    def earlier_reply(self, n: int) -> Message | None:
        try:
            return self.messages.first_reply(self.messages.find(n))
        except NotFound:
            return None

    def repeats_a_reply(self, text: str, tagged: list[int], event: TurnWritten) -> bool:
        """Untagged closing words that say again what a reply sent in this same turn said: kept out, and the agent told."""
        from journal.features.messages.feature import Messages as MessagesFeature
        prompt = self.turn_prompt(event)
        if tagged or not text or prompt is None:
            return False
        repeated = [r for r in self.messages.replies_since(prompt.created_at) if WordOverlap.share(text, r.text) >= REPEATS]
        if repeated:
            self.supervisor.type(event.environment_id, MessagesFeature.REPEATED_REPLY.create(reply=repeated[0].id, n=repeated[0].reply_to).rendered())
        return bool(repeated)

    def turn_prompt(self, event: TurnWritten) -> Entry | None:
        """The prompt that started the session's turn: its newest."""
        prompts = [e for e in self.entries.of_kind("PromptSubmitted") if e.actor and e.actor.id == event.session]
        return prompts[0] if prompts else None

    def stray_owed(self, whole: str) -> list[int]:
        """The messages a tag inside a line names that are still owed an answer; a tag quoted about another message, or one already answered, is only text."""
        strays = [int(n) for n in STRAY_TAG.findall(Tags.visible(whole))]
        if not strays:
            return []
        owed = {m.id for m in self.messages.unread() + self.messages.unanswered()}
        return [n for n in strays if n in owed]

    def already_recorded(self, part: str) -> bool:
        """A block reaches the journal twice when it is the turn's last, once from the transcript and once from the display hook: the second is the same words and is not a second message."""
        text = Tags.visible(part)
        return any(m.author == Author.AGENT and m.text == text for m in self.messages.recent(30))

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
        entry = self.turn_prompt(event)
        prompt = entry.data.get("prompt", "") if entry else ""
        if not prompt.startswith(JOURNAL_LINE) or self._answered_in_chat(event, prompt[len(JOURNAL_LINE):]):
            return False
        provider = self.providers.named(event.provider)
        since = self.entries.since(entry.id)
        return not any(e.kind == "ToolStarting" and provider.writes(e.data.get("tool_name", ""), e.data.get("tool_input", {})) for e in since)

    def _answered_in_chat(self, event: TurnWritten, line: str) -> bool:
        """The nudge the typed line came from, when it is one whose answer belongs in the chat."""
        said = [e for e in self.entries.of_kind("nudge") if e.data.get("session") == event.session and e.data.get("line") == line]
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
