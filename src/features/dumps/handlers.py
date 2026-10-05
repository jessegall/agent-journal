from dataclasses import dataclass
from typing import ClassVar

from engine.events.engine import ClockTicked
from engine.events.resources import MessageUpdated, ResourceEvent
from engine.transcript import IDLE
from engine.wording import plural
from features.dumps.controller import OWN_WORDS
from features.parts import AgentContext, Context, Handler
from resources.base import USER
from features.dumps.controller import Dumps
from controllers.types import Messages

FILED = "completed"


@dataclass(frozen=True)
class DumpWritten(ResourceEvent):
    on: ClassVar[str] = "dump"

    def wanted(self) -> bool:
        return self.action == FILED or (self.written and self.actor == USER)


class PromptFiling(Handler):
    def handle(self, context: Context, event: DumpWritten) -> None:
        dumps, speaking = context.journal.get(Dumps), context.to_primary()
        dump = dumps.load(event.n)
        if speaking and self.choice(speaking, dump):
            return
        if event.action == FILED:
            if speaking and not dump.data.get("stopped"):
                speaking.agent.say("filed", n=dump.n, outcome=dump.outcome)
            dump = dumps._in_hand()
            if not dump:
                return
        elif getattr(dumps._in_hand(), "n", 0) != dump.n:
            return
        if speaking and self.answer(speaking, dump):
            return
        waiting = [name for name in dump.item_names if not dump.item(name).insight]
        if speaking and waiting and not dump.completed:
            speaking.agent.say("arrived", n=dump.n, count=plural(len(waiting), "item"))

    def choice(self, speaking: AgentContext, dump) -> bool:
        chosen = dump.data.get("chosen") or {}
        if not chosen or not speaking.once("dump choice", f"{dump.n}:{chosen.get('at')}"):
            return False
        pick = int(chosen.get("pick", -1))
        if pick == OWN_WORDS:
            return True
        if pick < 0:
            speaking.agent.say("decide", n=dump.n)
        else:
            speaking.agent.say("chose", n=dump.n, label=chosen["label"])
        return True

    def answer(self, speaking: AgentContext, dump) -> bool:
        answers = dump.data.get("answers") or []
        if not answers or not speaking.once("dump answer", f"{dump.n}:{len(answers)}"):
            return False
        speaking.agent.say("answered", n=dump.n, answer=answers[-1]["answer"], question=answers[-1]["question"])
        return True


class TranscriptToDump(Handler):
    def handle(self, context: Context, event: MessageUpdated) -> None:
        messages = context.journal.get(Messages)
        message = messages.load(event.n)
        if message.data.get("kind") != "transcript" or any(ref.startswith("dump:") for ref in message.refs):
            return
        dumps = context.journal.acting(USER).get(Dumps)
        dump = dumps.create(brief=message.brief)
        for path in messages.paths(message.n):
            dumps.attach(dump.n, path)
        dumps.link(dump.n, message.ref)
        messages.link(message.n, dump.ref)


class CarryOnFiling(Handler):
    def handle(self, context: AgentContext, event: ClockTicked) -> None:
        if context.agent.row.status != IDLE:
            return
        dumps = context.journal.get(Dumps)
        dump = dumps._in_hand()
        if not dump or (dump.data.get("question") or {}).get("text"):
            return
        left = [name for name in dump.item_names if not dump.item(name).settled]
        stretch = f"{dump.n}:{context.agent.row.at}"
        if left and context.once("carried", stretch):
            context.agent.say("carry on", n=dump.n, count=plural(len(left), "item"))
