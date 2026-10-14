from pathlib import Path

from events import Fact
from events.agents import AgentMessageSent, AgentReported
from events.thinking import ThinkingCleared, TranscriptRead
from features.thinking.reading import THINKING, Read, reading_place
from payload import HookEvent
from receiving import Listener
from resources.types import AgentRow
from serving import Providers, ReadRemembered, ReadRows

TURN_STARTS = (HookEvent.USER_PROMPT_SUBMIT, HookEvent.SESSION_END)


class FollowTheTranscript(Listener[AgentReported]):
    def listen(self, event: AgentReported, agents: ReadRows[AgentRow], providers: Providers, memory: ReadRemembered) -> list[Fact]:
        row = agents.peek(event.agent)
        transcript = Path(row.transcript) if row.transcript else None
        kind = providers.offers(row.provider) if transcript and transcript.is_file() else None
        if not kind:
            return []
        shown = row.data.get(THINKING) or ""
        held = Read.from_json(memory.get(reading_place(row), {}))
        if held.path != str(transcript):
            return [TranscriptRead(agent=event.agent, path=str(transcript), offset=transcript.stat().st_size, thinking=shown)]
        found, offset = kind.thoughts(transcript, held.offset)
        for what, text in found:
            shown = text if what == THINKING else ""
        return [TranscriptRead(agent=event.agent, path=str(transcript), offset=offset, thinking="" if event.hook in TURN_STARTS else shown,
                               thoughts=tuple(text for what, text in found if what == THINKING and text.strip()))]


class SpotVisibleMessage(Listener[AgentMessageSent]):
    def listen(self, event: AgentMessageSent, agents: ReadRows[AgentRow]) -> list[Fact]:
        return [ThinkingCleared(agent=event.agent)] if event.text.strip() and agents.peek(event.agent).data.get(THINKING) else []
