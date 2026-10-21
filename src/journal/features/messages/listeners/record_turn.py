import re
import threading

from journal.events.agent.turn_displayed import TurnDisplayed
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
from journal.repositories.agents import Agents
from journal.repositories.entries import Entries
from journal.repositories.links import Links
from journal.repositories.messages import Messages
from journal.support.missing_row import MissingRow
from journal.supervisor_link import SupervisorLink

REPLY_TAG = re.compile(r"^[ \t]*(?:>\s?)?(?:\*\*)?\[!reply:(\d+(?:,\d+)*)\](?:\*\*)?[ \t]*", re.MULTILINE)
STRAY_TAG = re.compile(r"\[!reply:(\d+)\]")
JOURNAL_LINE = "[journal] "
SHORT = 240
REPEATS = 0.6


class RecordTurn(AgentListener[TurnDisplayed]):
    """Every whole turn the agent writes for the user becomes a message in the chat, its tags taken out. A [!reply:N] tag opening a line makes it the answer to message N (N,M answers both) and marks them read; a tag elsewhere is text, and the agent is told so. A [!log:N] turn belongs to the task's log alone. A turn that is only a face is not posted: the agent is told to react. A turn that only answered a journal line and changed nothing is kept as an acknowledgement, out of the chat."""

    def __init__(self, messages: Messages, entries: Entries, providers: Providers, registry: Registry, supervisor: SupervisorLink, links: Links, agents: Agents) -> None:
        self.messages, self.entries, self.providers, self.registry, self.supervisor, self.links, self.agents = messages, entries, providers, registry, supervisor, links, agents
        self.recording = threading.Lock()  # the same block arrives at once from the transcript and from the display hook

    def handle(self, event: TurnDisplayed) -> None:
        from journal.features.messages.feature import Messages as MessagesFeature
        if not event.final or not event.text.strip():
            return
        if Faces.is_face(event.text):
            self.supervisor.type(event.environment_id, MessagesFeature.FACE_REPLY.create(face=event.text.strip()).rendered())
            return
        with self.recording:
            self._record(event)

    def _record(self, event: TurnDisplayed) -> None:
        actor, whole = Actor.agent(event.session), event.text
        for tagged, part in self.sections(whole):
            if self.is_recorded(part):
                continue
            text = Tags.visible(part)
            answered = self.unanswered(tagged, event)
            quiet = (Tags.hidden(part) and not answered) or self.is_repeat_reply(text, tagged, event)
            acknowledgement = not answered and len(text) <= SHORT and "?" not in text and self._journal_answer(event)
            if text and not quiet:
                reply = self.messages.save(Message(author=Author.AGENT, text=text, reply_to=answered[0] if answered else None, acknowledgement=acknowledgement), actor)
                for n in answered[1:]:
                    self._other_answers(reply, n, actor)
            for n in answered:
                self._read_receipt(n, actor)
        for n in self.orphan_obligation(whole)[:1]:
            self.supervisor.type(event.environment_id, f"the [!reply:{n}] tag must open a line of your turn; message {n} is still unanswered")

    def unanswered(self, tagged: list[int], event: TurnDisplayed) -> list[int]:
        from journal.features.messages.feature import Messages as MessagesFeature
        fresh = [n for n in tagged if self.earlier_reply(n) is None]
        if tagged and not fresh:
            said = MessagesFeature.DUPLICATE_REPLY.create(n=tagged[0], reply=self.earlier_reply(tagged[0]).id)
            self.supervisor.type(event.environment_id, said.rendered())
        return fresh

    def earlier_reply(self, n: int) -> Message | None:
        try:
            return self.messages.first_reply(self.messages.find(n))
        except MissingRow:
            return None

    def is_repeat_reply(self, text: str, tagged: list[int], event: TurnDisplayed) -> bool:
        from journal.features.messages.feature import Messages as MessagesFeature
        prompt = self.turn_prompt(event)
        if tagged or not text or prompt is None:
            return False
        repeated = [r for r in self.messages.recent_replies(prompt.created_at) if WordOverlap.share(text, r.text) >= REPEATS]
        if repeated:
            self.supervisor.type(event.environment_id, MessagesFeature.REPEATED_CLOSING_TEXT.create(reply=repeated[0].id, n=repeated[0].reply_to).rendered())
        return bool(repeated)

    def turn_prompt(self, event: TurnDisplayed) -> Entry | None:
        prompts = [e for e in self.entries.kind_entries("PromptSubmitted") if e.actor and e.actor.id == event.session]
        return prompts[0] if prompts else None

    def orphan_obligation(self, whole: str) -> list[int]:
        strays = [int(n) for n in STRAY_TAG.findall(Tags.visible(whole))]
        if not strays:
            return []
        owed = {m.id for m in self.messages.unread() + self.messages.unanswered()}
        return [n for n in strays if n in owed]

    def is_recorded(self, part: str) -> bool:
        text = Tags.visible(part)
        return any(m.author == Author.AGENT and m.text == text for m in self.messages.recent(30))

    @staticmethod
    def sections(whole: str) -> list[tuple[list[int], str]]:
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

    def _journal_answer(self, event: TurnDisplayed) -> bool:
        entry = self.turn_prompt(event)
        prompt = entry.data.get("prompt", "") if entry else ""
        if not prompt.startswith(JOURNAL_LINE) or self._chat_answer(event, prompt[len(JOURNAL_LINE):]):
            return False
        provider = self.providers.lookup(event.provider)
        since = self.entries.recent(entry.id)
        return not any(e.kind == "ToolStarting" and e.is_write() for e in since)

    def _chat_answer(self, event: TurnDisplayed, line: str) -> bool:
        said = [e for e in self.entries.kind_entries("nudge") if e.data.get("session") == event.session and e.data.get("line") == line]
        nudge = self.registry.nudge_keyed(said[-1].data["key"]) if said else None
        return bool(nudge and nudge.answered_in_chat)

    def _other_answers(self, reply: Message, n: int, actor: Actor) -> None:
        try:
            self.links.save(Link(source=Ref.build(reply), target=Ref.build(self.messages.find(n)), kind=Messages.ANSWERS), actor)
        except MissingRow:
            return

    def _read_receipt(self, n: int, actor: Actor) -> None:
        try:
            self.messages.read(self.messages.find(n), actor, self.agents.session_agent(actor.id).tool_uses)
        except MissingRow:
            return
