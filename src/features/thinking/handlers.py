from dataclasses import dataclass
from pathlib import Path

from engine.events import AgentMessageSent, AgentReported
from features.parts import AgentContext, Handler
from providers import PROVIDERS
from engine.fields import Loaded

THINKING = "thinking"
TURN_STARTS = ("UserPromptSubmit", "SessionEnd")


@dataclass(frozen=True)
class Read(Loaded):
    path: str = ""
    offset: int = 0


class FollowThinking(Handler):
    def handle(self, context: AgentContext, event: AgentReported) -> None:
        row = context.agent.row
        kind, transcript = PROVIDERS.get(row.provider), Path(row.transcript)
        if not kind or not transcript.is_file():
            return
        held = Read.from_json(context.state.get("transcript", {}))
        if held.path != str(transcript):
            context.state.set("transcript", {"path": str(transcript), "offset": transcript.stat().st_size})
            return
        found, offset = kind().thoughts(transcript, held.offset)
        context.state.set("transcript", {"path": str(transcript), "offset": offset})
        thought = row.data.get(THINKING) or ""
        for what, text in found:
            thought = text if what == THINKING else ""
        if event.hook in TURN_STARTS:
            thought = ""
        if thought != (row.data.get(THINKING) or ""):
            context.journal.agents.stamp(row.n, **{THINKING: thought})


class ClearOnMessage(Handler):
    def handle(self, context: AgentContext, event: AgentMessageSent) -> None:
        if event.text.strip() and context.agent.row.data.get(THINKING):
            context.journal.agents.stamp(context.agent.row.n, **{THINKING: ""})
