from dataclasses import dataclass
from typing import ClassVar

from engine.events import ClockTicked, ResourceEvent
from engine.transcript import IDLE
from features.dumps.controller import OWN_WORDS
from features.dumps.resource import ITEM
from features.parts import AgentContext, Context, Handler
from resources.base import USER

WRITTEN = ("created", "updated")
FILED = "completed"


@dataclass(frozen=True)
class DumpWritten(ResourceEvent):
    on: ClassVar[str] = "dump"

    def wanted(self) -> bool:
        return self.action == FILED or (self.action in WRITTEN and self.actor == USER)


class PromptFiling(Handler):
    def handle(self, context: Context, event: DumpWritten) -> None:
        dumps, agent = context.journal.dumps, context.journal.agents.primary()
        dump = dumps.load(event.n)
        speaking = context.speaking_to(agent) if agent else None
        chosen = dump.data.get("chosen") or {}
        if speaking and chosen and speaking.once("dump choice", f"{dump.n}:{chosen.get('at')}"):
            if int(chosen.get("pick", -1)) == OWN_WORDS:
                return
            if int(chosen.get("pick", -1)) < 0:
                speaking.agent.say("decide", n=dump.n)
            else:
                speaking.agent.say("chose", n=dump.n, label=chosen["label"])
            return
        if event.action == FILED:
            if speaking and not dump.data.get("stopped"):
                speaking.agent.say("filed", n=dump.n, outcome=dump.outcome)
            dump = dumps._in_hand()
            if not dump:
                return
        elif getattr(dumps._in_hand(), "n", 0) != dump.n:
            return
        answers = dump.data.get("answers") or []
        if speaking and answers and speaking.once("dump answer", f"{dump.n}:{len(answers)}"):
            speaking.agent.say("answered", n=dump.n, answer=answers[-1]["answer"], question=answers[-1]["question"])
            return
        items = dump.data.get("items") or {}
        waiting = [name for name in dumps._names(dump) if not (items.get(name) or {}).get(ITEM.insight)]
        if agent and waiting and not dump.completed:
            context.speaking_to(agent).agent.say("arrived", n=dump.n, count=context.feature.plural(len(waiting), "item"))


@dataclass(frozen=True)
class MessageUpdated(ResourceEvent):
    on: ClassVar[str] = "message.updated"


class TranscriptToDump(Handler):
    def handle(self, context: Context, event: MessageUpdated) -> None:
        messages = context.journal.messages
        message = messages.load(event.n)
        if message.data.get("kind") != "transcript" or any(ref.startswith("dump:") for ref in message.refs):
            return
        dumps = context.journal.acting(USER).dumps
        dump = dumps.create(brief=message.brief)
        for path in messages.paths(message.n):
            dumps.attach(dump.n, path)
        dumps.link(dump.n, message.ref)
        messages.link(message.n, dump.ref)


class CarryOnFiling(Handler):
    def handle(self, context: AgentContext, event: ClockTicked) -> None:
        if context.agent.row.status != IDLE:
            return
        dumps = context.journal.dumps
        dump = dumps._in_hand()
        if not dump or (dump.data.get("question") or {}).get("text"):
            return
        items = dump.data.get("items") or {}
        left = [name for name in dumps._names(dump) if not ((items.get(name) or {}).get(ITEM.outcome) or (items.get(name) or {}).get(ITEM.failed))]
        stretch = f"{dump.n}:{context.agent.row.at}"
        if left and context.state.get("carried") != stretch:
            context.state.set("carried", stretch)
            context.agent.say("carry on", n=dump.n, count=context.feature.plural(len(left), "item"))
