from events import Fact
from events.thinking import ThinkingCleared, TranscriptRead
from features.thinking.reading import THINKING, reading_place
from receiving import Handler
from resources.types import AgentRow
from serving import Clock, Remembered, Rows

THOUGHTS = "thoughts"
KEPT_THOUGHTS = 60
THOUGHT_CHARS = 1200


class ShowTheThoughts(Handler[TranscriptRead]):
    def handle(self, event: TranscriptRead, agents: Rows[AgentRow], memory: Remembered, clock: Clock) -> list[Fact]:
        row = agents.peek(event.agent)
        memory.set(reading_place(row), {"path": event.path, "offset": event.offset})
        changes = {THINKING: event.thinking} if event.thinking != (row.data.get(THINKING) or "") else {}
        if event.thoughts:
            now = clock.now()
            changes[THOUGHTS] = [*(row.data.get(THOUGHTS) or []), *({"at": now, "text": text[:THOUGHT_CHARS]} for text in event.thoughts)][-KEPT_THOUGHTS:]
        if changes:
            agents.stamp(row.n, **changes)
        return []


class ClearTheThought(Handler[ThinkingCleared]):
    def handle(self, event: ThinkingCleared, agents: Rows[AgentRow]) -> list[Fact]:
        agents.stamp(event.agent, **{THINKING: ""})
        return []
