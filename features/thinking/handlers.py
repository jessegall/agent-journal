from pathlib import Path

from engine.events import AgentMessageSent, AgentUpdated
from features.parts import AgentContext, Handler
from providers import PROVIDERS
from resources.base import AGENT, titled

THINKING = "thinking"
TURN_STARTS = ("UserPromptSubmit", "SessionEnd")


class FollowThinking(Handler):
    def handle(self, context: AgentContext, event: AgentUpdated) -> None:
        row = context.agent.row
        kind, transcript = PROVIDERS.get(row.provider), Path(row.transcript or "")
        if not kind or not transcript.is_file():
            return
        held = context.state.get("transcript", {})
        if held.get("path") != str(transcript):
            context.state.set("transcript", {"path": str(transcript), "offset": transcript.stat().st_size})
            return
        found, offset = kind().thoughts(transcript, int(held.get("offset") or 0))
        context.state.set("transcript", {"path": str(transcript), "offset": offset})
        thought = row.data.get(THINKING) or ""
        for what, text in found:
            thought = text if what == THINKING else ""
        if thought and event.hook in TURN_STARTS:
            context.journal.acting(AGENT).messages.create(titled(thought), brief=thought, thinking=True)
            thought = ""
        if thought != (row.data.get(THINKING) or ""):
            context.journal.agents.stamp(row.n, **{THINKING: thought})


class ClearOnMessage(Handler):
    def handle(self, context: AgentContext, event: AgentMessageSent) -> None:
        if event.text.strip() and context.agent.row.data.get(THINKING):
            context.journal.agents.stamp(context.agent.row.n, **{THINKING: ""})
