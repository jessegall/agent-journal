import re
from dataclasses import dataclass
from typing import ClassVar

from engine.events import AgentMessageSent, AgentUpdated, ResourceCreated, ResourceEvent
from engine.transcript import IDLE, last_text
from features import trigger
from features.messages.answering import in_hand, read_and_open, theirs, unanswered
from features.parts import AgentContext, Context, Handler
from resources.base import AGENT, ENVIRONMENT, SECTION, USER, titled
from resources.types import TYPES

LINKED = ("message", "comment", "reaction", "nudge", "notification", "agent")
ANSWERS = {"comment": "answered", "reaction": "acknowledged"}
RUN_ON, SENTENCES = 400, 3


@dataclass(frozen=True)
class MessageCreated(ResourceEvent):
    on: ClassVar[str] = "message.created"


@dataclass(frozen=True)
class MessagesUpdated(ResourceEvent):
    on: ClassVar[str] = "message.updated"
    numbers: tuple = ()

    @classmethod
    def read(cls, event) -> "MessagesUpdated":
        return cls(n=event.n, action=event.action, type=event.type, actor=event.actor, numbers=tuple(event.data.get("numbers") or [event.n]))


def counted(context: Context, behaviour: str) -> int:
    key, row = context.feature.keyed(behaviour), context.agent.row
    count = int(trigger.last(context.record, row.title, key).get("count") or 0) + 1
    trigger.write(context.record, row, key, count=count)
    return count


def patient(context: Context, behaviour: str) -> int:
    return int(context.settings[f"{behaviour}.patience"])


class SaveAgentMessage(Handler):
    def handle(self, context: AgentContext, event: AgentMessageSent) -> None:
        if event.text.strip() and context.once("shown", event.text):
            context.journal.acting(AGENT).messages.create(titled(event.text), brief=event.text)


class ResetCountsOnArrival(Handler):
    def handle(self, context: Context, event: MessageCreated) -> None:
        every = context.feature.behaviours["unread"].trigger.every
        for row in context.feature.live(context.record):
            trigger.write(context.record, row, context.feature.keyed("unread"), uses=int(row.uses or 0) - every)
            trigger.write(context.record, row, context.feature.keyed("answering"), uses=int(row.uses or 0), count=0)


class NameUnread(Handler):
    def handle(self, context: AgentContext, event: AgentUpdated) -> None:
        if not any(AGENT not in row["seen"] and not row["completed"] and not row["deleted"] for row in context.journal.messages.summaries()):
            context.release("unread")
            trigger.write(context.record, context.agent.row, context.feature.keyed("unread"), count=0)
            return
        if not context.due("unread"):
            return
        context.agent.whisper("inbox")
        if counted(context, "unread") > patient(context, "unread"):
            context.hold("inbox held", "unread")


class NameUnanswered(Handler):
    def handle(self, context: AgentContext, event: AgentUpdated) -> None:
        held = unanswered(context.journal)
        if not held:
            trigger.write(context.record, context.agent.row, context.feature.keyed("answering"), count=0)
            return
        if context.due("answering") and counted(context, "answering") <= patient(context, "answering"):
            context.agent.whisper("answer", messages=", ".join(f"message {m.n}" for m in held[-3:]))


class CloseHandled(Handler):
    behaviour = "closing"

    def handle(self, context: AgentContext, event: AgentUpdated) -> None:
        if context.agent.row.status != IDLE:
            return
        for message in read_and_open(context.journal):
            results = [*message.refs, *(s[SECTION.body] for s in message.sections)]
            if results:
                context.journal.messages.complete(message.n, how=f"handled: {', '.join(dict.fromkeys(results))}")


class CloseSeenByUser(Handler):
    behaviour = "closing"

    def handle(self, context: Context, event: MessagesUpdated) -> None:
        messages = context.journal.messages
        for n in event.numbers:
            message = messages.load(int(n))
            if not message.completed and not theirs(message) and USER in message.seen:
                messages.complete(message.n, how="read by the user")


class CloseAnswered(Handler):
    behaviour = "closing"

    def handle(self, context: Context, event: ResourceCreated) -> None:
        if event.type not in ANSWERS or event.actor != AGENT:
            return
        messages = context.journal.messages
        for ref in context.journal.of(event.type).load(event.n).refs:
            kind, _, n = ref.partition(":")
            if kind != "message" or not n.isdigit():
                continue
            message = messages.load(int(n))
            if not message.completed and theirs(message):
                messages.complete(message.n, how=f"{ANSWERS[event.type]} by the agent")


class LinkToMessageInHand(Handler):
    behaviour = "linking"

    def handle(self, context: Context, event: ResourceCreated) -> None:
        if event.actor != AGENT or event.type in LINKED:
            return
        message = in_hand(context.journal)
        ref = f"{event.type}:{event.n}"
        if message and ref not in message.refs:
            context.journal.messages.link(message.n, ref)


class NameRunTogether(Handler):
    behaviour = "paragraphs"

    def handle(self, context: AgentContext, event: AgentUpdated) -> None:
        last = last_text(context.record, context.agent.row).strip()
        if len(last) >= RUN_ON and "\n\n" not in last and last.count(". ") >= SENTENCES:
            context.agent.whisper("paragraphs")


STANDALONE = re.compile(r"(?<![\w.,:/–—-])#?(\d+)(?![\w%:/–—-]|[.,]\d)")
QUOTED = re.compile(r"`[^`]*`|\"[^\"]*\"|“[^”]*”")
LISTED = re.compile(r"^\s*\d+[.)]\s", re.MULTILINE)
NAMING = {"to-do", "to-dos", "version", "v", "line", "lines", "phase", "step", "port", "revision", "revisions", "number", "page", "row", "rows",
          "commit", "id", "of", "and", "or", "under", "over", "than", "above", "below", "about", "around", "least", "most", "nearly",
          "only", "every", "first", "last", "top", "within", "past", "after"}
VERBS = {"waits", "needs", "holds", "runs", "goes", "shows", "stays", "keeps", "closes", "opens", "starts", "ends", "lands", "takes",
         "gets", "makes", "sits", "asks", "says", "works", "fails", "passes", "comes", "becomes", "belongs", "covers", "lists", "reads"}
COUNTING = {"passed", "failed", "more", "left", "of", "per", "out", "times", "ms", "kb", "mb", "px", "percent", "in"}


def typed_before(text: str) -> bool:
    words = re.findall(r"[\w-]+", text.lower())[-1:]
    return bool(words) and (words[0] in NAMING or words[0].rstrip("s") in TYPES)


def unit_after(text: str) -> bool:
    words = re.match(r"[ \t]*([a-z]+)(?:[ \t]+([a-z]+))?", text.lower())
    return bool(words) and (words.group(1) in COUNTING or any(len(w) > 3 and w.endswith("s") and w not in VERBS for w in words.groups() if w))


HANDLED = re.compile(r"\b(?:repl(?:y|ied|ying) to|answer(?:ed|ing)?|clos(?:ed|ing)|fil(?:ed|ing)|start(?:ed|ing)|park(?:ed|ing)|resum(?:ed|ing)|end(?:ed|ing)"
                     r"|finish(?:ed|ing)|struck|reopen(?:ed|ing)|process(?:ed|ing))\s+#?$", re.IGNORECASE)
SMALL = 100


def bare(text: str) -> list[int]:
    text = LISTED.sub("", QUOTED.sub("", text))
    return list(dict.fromkeys(int(m.group(1)) for m in STANDALONE.finditer(text)
                              if not typed_before(text[max(0, m.start() - 24):m.start()]) and not unit_after(text[m.end():m.end() + 16])
                              and (int(m.group(1)) >= SMALL or HANDLED.search(text[max(0, m.start() - 24):m.start()]))))


class NameBareNumbers(Handler):
    behaviour = "numbers"

    def handle(self, context: AgentContext, event: AgentMessageSent) -> None:
        found = bare(event.text)
        if not found:
            return
        known = numbers(context)
        named = [str(n) for n in found if n in known]
        sent = next((m for m in reversed(context.journal.messages.summaries()) if m["seen"][:1] == [AGENT]), None)
        if named and sent:
            context.agent.whisper("numbers", n=sent["n"], numbers=", ".join(named))


def numbers(context: AgentContext) -> set[int]:
    return {row["n"] for name, type_ in TYPES.items() if type_.scope == ENVIRONMENT for row in context.journal.of(name).summaries()}
