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
from journal.models.support.ref import Ref
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
SHORT_CHARACTERS = 240
REPEAT_OVERLAP_RATIO = 0.6


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
            self.supervisor.type(event.environment_id, MessagesFeature.EMOJI_REPLY.create(face=event.text.strip()).rendered())
            return
        with self.recording:
            self._record(event)

    def _record(self, event: TurnDisplayed) -> None:
        actor, full = Actor.agent(event.session), event.text
        for tagged, part in self.sections(full):
            if self.is_recorded(part):
                continue
            text = Tags.visible(part)
            answered = self.unanswered(tagged, event)
            silent = (Tags.hidden(part) and not answered) or self.is_repeat_reply(text, tagged, event)
            acknowledgement = not answered and len(text) <= SHORT_CHARACTERS and "?" not in text and self._journal_answer(event)
            if text and not silent:
                reply = self.messages.save(Message(author=Author.AGENT, text=text, reply_target=answered[0] if answered else None, acknowledgement=acknowledgement), actor)
                for n in answered[1:]:
                    self._other_answers(reply, n, actor)
            for n in answered:
                self._read_receipt(n, actor)
        for n in self.orphan_obligation(full)[:1]:
            self.supervisor.type(event.environment_id, f"the [!reply:{n}] tag must open a line of your turn; message {n} is still unanswered")

    def unanswered(self, tagged: list[int], event: TurnDisplayed) -> list[int]:
        from journal.features.messages.feature import Messages as MessagesFeature
        replied = [(n, reply) for n in tagged if (reply := self.earlier_reply(n)) is not None]
        recent = [n for n in tagged if n not in {m for m, _ in replied}]
        if replied and not recent:
            line_text = MessagesFeature.DUPLICATE_REPLY.create(n=replied[0][0], reply=replied[0][1].id)
            self.supervisor.type(event.environment_id, line_text.rendered())
        return recent

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
        repeated = WordOverlap.repeats(text, self.messages.recent_replies(prompt.creation_time), REPEAT_OVERLAP_RATIO)
        if repeated:
            self.supervisor.type(event.environment_id, MessagesFeature.REPEATED_CLOSING_TEXT.create(reply=repeated[0].id, n=repeated[0].reply_target).rendered())
        return bool(repeated)

    def turn_prompt(self, event: TurnDisplayed) -> Entry | None:
        prompts = self.entries.session_kind_entries("PromptSubmitted", event.session)
        return prompts[0] if prompts else None

    def orphan_obligation(self, full: str) -> list[int]:
        strays = [int(n) for n in STRAY_TAG.findall(Tags.visible(full))]
        if not strays:
            return []
        obligations = {m.id for m in self.messages.unread() + self.messages.unanswered()}
        return [n for n in strays if n in obligations]

    def is_recorded(self, part: str) -> bool:
        text = Tags.visible(part)
        return bool(self.messages.voice_matches(text, 30))

    @staticmethod
    def sections(full: str) -> list[tuple[list[int], str]]:
        tags = list(REPLY_TAG.finditer(full))
        numbers = lambda tag: [int(n) for n in tag.group(1).split(",")]
        if len(tags) <= 1:
            return [([n for tag in tags for n in numbers(tag)], full)]
        parts = []
        for i, tag in enumerate(tags):
            end = tags[i + 1].start() if i + 1 < len(tags) else len(full)
            lead = full[: tag.start()].strip() if i == 0 else ""
            remainder = full[tag.end():end].strip()
            parts.append((numbers(tag), f"{lead}\n\n{remainder}" if lead else remainder))
        return parts

    def _journal_answer(self, event: TurnDisplayed) -> bool:
        entry = self.turn_prompt(event)
        if entry is None:
            return False
        prompt = entry.data.get("prompt", "")
        if not prompt.startswith(JOURNAL_LINE) or self._chat_answer(event, prompt[len(JOURNAL_LINE):]):
            return False
        provider = self.providers.lookup(event.provider)
        start = self.entries.recent(entry.row_id)
        return not any(e.kind == "ToolStarting" and e.is_write() for e in start)

    def _chat_answer(self, event: TurnDisplayed, line: str) -> bool:
        line_text = self.entries.line_entries(event.session, line)
        nudge = self.registry.nudge_keyed(line_text[-1].data["key"]) if line_text else None
        return bool(nudge and nudge.chat_answerable)

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
