from declaring.reach import Reach
from events import Fact
from events.agents import AgentMessageSent, AgentReported, TurnInterrupted, TurnStopped
from events.messages import (PromptBegan, TurnCutOff, TurnEnded, AnswerHeld, AnswerOwed, AnswerRearmed, AnswersSettled, AnswerWaitBegan, BareNumbersNamed, FaceSent, InboxRearmed, InboxSettled, InboxUnread, MessageCreated,
                             MessageSettled, MessagesReadByUser, MessageUpdated, RunTogether, TurnToPost)
from events.resources import ResourceCreated
from features.messages.answering import read_and_open, theirs, unanswered
from features.messages.details import MessagesDetails
from features.messages.prose import RUN_ON, SENTENCES, bare, numbers
from framework.displayed import SETTLE, arrives
from payload import HookEvent
from receiving import Listener
from resources.base import AGENT, SECTION, USER
from resources.text import only_emoji
from resources.types import IDLE, STOPPED, AgentRow, Comment, Message, Reaction
from serving import Providers, ReadElsewhere, ReadMarks, ReadRows, Settings

INBOX_AFTER = 5
ANSWERS = {"comment": "answered", "reaction": "acknowledged"}
LINES = {line.name: line for line in MessagesDetails.lines}
UNREAD_EVERY = next(behaviour.trigger.every for behaviour in MessagesDetails.behaviours if behaviour.name == "unread")
ANSWER_HOLD = "messages.answer hold"


def reached(agents: ReadRows[AgentRow], line: str) -> list[AgentRow]:
    """The agents a line reaches: those that have not stopped, of the kind the line is for."""
    return [agent for agent in agents.rows.standing() if agent.status != STOPPED and LINES[line].reach.reaches(agent.subagent)]


def numbered(messages: list) -> str:
    return ", ".join(f"message {m.n}" for m in messages[-3:])


def settled_as_handled(messages: ReadRows[Message], message: Message) -> list[Fact]:
    """A message the agent processed into rows counts as answered once it is: a question stays open until a written reply."""
    if not (message.refs or message.sections) or not messages.is_answered(message):
        return []
    results = [*message.refs, *(s[SECTION.body] for s in message.sections)]
    return [MessageSettled(n=message.n, how=f"handled: {', '.join(dict.fromkeys(results))}")]


class SpotTurnToPost(Listener[AgentMessageSent]):
    def listen(self, event: AgentMessageSent) -> list[Fact]:
        if not event.text.strip():
            return []
        if only_emoji(event.text):
            return [FaceSent(agent=event.agent, face=event.text.strip()).once(event.turn)]
        return [TurnToPost(agent=event.agent, text=event.text, turn=event.turn).once(event.turn)]


class SpotArrival(Listener[MessageCreated]):
    def listen(self, event: MessageCreated, agents: ReadRows[AgentRow]) -> list[Fact]:
        return [*(InboxRearmed(agent=agent.n, uses=int(agent.uses)) for agent in reached(agents, "inbox")),
                *(AnswerRearmed(agent=agent.n, uses=int(agent.uses)) for agent in reached(agents, "answer"))]


class SpotUnread(Listener[AgentReported]):
    def listen(self, event: AgentReported, agents: ReadRows[AgentRow], messages: ReadRows[Message]) -> list[Fact]:
        unread = messages.unread(AGENT)
        if not unread or len(unread) <= INBOX_AFTER and agents.peek(event.agent).status != IDLE:
            return [InboxSettled(agent=event.agent)]
        return [InboxUnread(agent=event.agent).due("unread")]


class SpotUnanswered(Listener[AgentReported]):
    def listen(self, event: AgentReported, agents: ReadRows[AgentRow], messages: ReadRows[Message], comments: ReadRows[Comment], reactions: ReadRows[Reaction],
               marks: ReadMarks, settings: Settings) -> list[Fact]:
        held, row = unanswered(messages, comments, reactions), agents.peek(event.agent)
        if not held:
            return [AnswersSettled(agent=row.n)]
        began = marks.last(ANSWER_HOLD).uses
        since = began or int(row.uses) or 1
        owed = AnswerOwed(agent=row.n, messages=numbered(held), numbers=tuple(m.n for m in held[-3:]), rows=tuple(m.ref for m in held[-3:]))
        facts = [owed if row.status == IDLE else owed.due("answering")]
        if not began:
            facts.insert(0, AnswerWaitBegan(agent=row.n, uses=since))
        if int(row.uses) - since >= int(getattr(settings, "answering.hold")):
            facts.insert(0, AnswerHeld(agent=row.n, messages=numbered(held)))
        return facts


class SpotMessagesHandled(Listener[AgentReported]):
    def listen(self, event: AgentReported, agents: ReadRows[AgentRow], messages: ReadRows[Message], settings: Settings) -> list[Fact]:
        if not settings.is_on("closing") or agents.peek(event.agent).status != IDLE:
            return []
        return [fact for message in read_and_open(messages) for fact in settled_as_handled(messages, message)]


class SpotMessagesSeenByUser(Listener[MessageUpdated]):
    def listen(self, event: MessageUpdated, messages: ReadRows[Message], settings: Settings) -> list[Fact]:
        seen = [m.n for m in map(messages.load, event.numbers if settings.is_on("closing") else ()) if not theirs(m) and USER in m.seen]
        return [MessagesReadByUser(numbers=tuple(seen))] if seen else []


class SpotMessagesProcessed(Listener[MessageUpdated]):
    def listen(self, event: MessageUpdated, messages: ReadRows[Message], settings: Settings) -> list[Fact]:
        processed = [m for m in map(messages.load, event.numbers if settings.is_on("closing") else ()) if theirs(m) and AGENT in m.seen and not m.completed]
        return [fact for message in processed for fact in settled_as_handled(messages, message)]


class SpotMessagesAnswered(Listener[ResourceCreated]):
    def listen(self, event: ResourceCreated, messages: ReadRows[Message], comments: ReadRows[Comment], reactions: ReadRows[Reaction], settings: Settings) -> list[Fact]:
        if event.type not in ANSWERS or event.actor != AGENT or not settings.is_on("closing"):
            return []
        refs = (comments if event.type == "comment" else reactions).load(event.n).refs
        asked = [messages.load(n) for kind, _, n in (ref.partition(":") for ref in refs) if kind == "message" and n.isdigit()]
        return [MessageSettled(n=m.n, how=f"{ANSWERS[event.type]} by the agent") for m in asked if theirs(m) and messages.is_settled_by(event.type, m)]


class SpotRunTogether(Listener[AgentReported]):
    def listen(self, event: AgentReported, agents: ReadRows[AgentRow], providers: Providers, settings: Settings) -> list[Fact]:
        last = providers.last_said(agents.peek(event.agent)).strip() if settings.is_on("paragraphs") else ""
        return [RunTogether(agent=event.agent).due("paragraphs")] if len(last) >= RUN_ON and "\n\n" not in last and last.count(". ") >= SENTENCES else []


class SpotBareNumbers(Listener[AgentMessageSent]):
    def listen(self, event: AgentMessageSent, messages: ReadRows[Message], elsewhere: ReadElsewhere, settings: Settings) -> list[Fact]:
        found = bare(event.text) if settings.is_on("numbers") else []
        if not found:
            return []
        known = numbers(elsewhere.here())
        named = [str(n) for n in found if n in known]
        sent = next((m for m in reversed(messages.rows.summaries()) if m.seen[:1] == [AGENT]), None)
        return [BareNumbersNamed(agent=event.agent, n=sent.n, numbers=", ".join(named))] if named and sent else []


class SpotTurnEnd(Listener[TurnStopped]):
    def listen(self, event: TurnStopped, agents: ReadRows[AgentRow], elsewhere: ReadElsewhere) -> list[Fact]:
        row = agents.peek(event.agent)
        ended = TurnEnded(agent=row.n, words=row.last_message)
        late = bool(row.last_message) and not arrives(elsewhere.here().record.root, row.title, row.last_message)
        return [ended.spaced(f"turn end|{row.n}", SETTLE) if late else ended]


class SpotPrompt(Listener[AgentReported]):
    def listen(self, event: AgentReported) -> list[Fact]:
        return [PromptBegan(agent=event.agent)] if event.hook == HookEvent.USER_PROMPT_SUBMIT else []


class SpotCutOff(Listener[TurnInterrupted]):
    def listen(self, event: TurnInterrupted) -> list[Fact]:
        return [TurnCutOff(agent=event.agent, words=event.text)]
