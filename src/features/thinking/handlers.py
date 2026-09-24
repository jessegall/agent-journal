import time
from dataclasses import dataclass
from pathlib import Path

from engine.events import AgentMessageSent, AgentReported
from features.parts import AgentContext, Handler
from providers import PROVIDERS
from engine.fields import Loaded

THINKING = "thinking"
THOUGHTS = "thoughts"
KEPT_THOUGHTS = 60
THOUGHT_CHARS = 1200
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
        kept = [text for what, text in found if what == THINKING and text.strip()]
        changes = {THINKING: thought} if thought != (row.data.get(THINKING) or "") else {}
        if kept:
            now = time.time()
            changes[THOUGHTS] = [*(row.data.get(THOUGHTS) or []), *({"at": now, "text": text[:THOUGHT_CHARS]} for text in kept)][-KEPT_THOUGHTS:]
        if changes:
            context.journal.agents.stamp(row.n, **changes)



class ClearOnMessage(Handler):
    def handle(self, context: AgentContext, event: AgentMessageSent) -> None:
        if event.text.strip() and context.agent.row.data.get(THINKING):
            context.journal.agents.stamp(context.agent.row.n, **{THINKING: ""})
