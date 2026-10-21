import threading

from journal.config import Config
from journal.engine.clock import Clock
from journal.events.agent.agent_event import AgentEvent
from journal.events.agent.turn_displayed import TurnDisplayed
from journal.providers.support.file_writes import FileWrites
from journal.support.context_file import ContextFile
from journal.support.hook import Hook
from journal.support.hook_kind import HookKind
from journal.models.environment import Environment
from journal.providers.providers import Providers

START_POSITION = -1


class TranscriptTurns:
    """The text blocks an agent writes before a tool call never reach the display hook, which brings only a turn's last block; so at every other hook the agent's transcript is read from where it was left, and each block written since becomes a whole turn of its own, before the hook's event is handled."""

    def __init__(self, config: Config, providers: Providers, context: ContextFile, clock: Clock) -> None:
        self.config, self.providers, self.context, self.clock = config, providers, context, clock
        self._read: dict[str, int] = {}
        self._reading = threading.Lock()

    def events(self, hook: Hook, environment: Environment) -> list[AgentEvent]:
        if hook.kind == HookKind.MESSAGE_DISPLAY:
            return []
        with self._reading:
            written = self.providers.named(hook.provider).texts_written(self.config.root, hook.session, self._read.get(hook.session, START_POSITION))
            self._read[hook.session] = written.time
        turns = [TurnDisplayed(text=text, delta=text, turn_id=f"transcript:{hook.session}:{i}", final=True) for i, text in enumerate(written.texts)]
        return [event.placed(hook.session, environment.id, hook.provider, self.context.of(hook.session), self.clock.now(), hook.subagent) for event in [*written.crossed, *turns]]

    def missed(self, session: str, provider: str, until: float) -> FileWrites:
        with self._reading:
            written = self.providers.named(provider).texts_written_before(self.config.root, session, self._read.get(session, START_POSITION), until)
            self._read[session] = written.time
        return written
