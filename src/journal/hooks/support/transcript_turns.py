import threading

from journal.config import Config
from journal.events.agent.turn_written import TurnWritten
from journal.support.context_file import ContextFile
from journal.support.hook import Hook
from journal.support.hook_kind import HookKind
from journal.models.environment import Environment
from journal.providers.providers import Providers

FIRST_LOOK = -1
"""Where a session's transcript is read from before it was ever read: its end."""


class TranscriptTurns:
    """The text blocks an agent writes before a tool call never reach the display hook, which brings only a turn's last block; so at every other hook the agent's transcript is read from where it was left, and each block written since becomes a whole turn of its own, before the hook's event is handled."""

    def __init__(self, config: Config, providers: Providers, context: ContextFile) -> None:
        self.config, self.providers, self.context = config, providers, context
        self._read: dict[str, int] = {}
        self._reading = threading.Lock()

    def events(self, hook: Hook, environment: Environment) -> list[TurnWritten]:
        if hook.kind == HookKind.MESSAGE_DISPLAY:
            return []
        with self._reading:
            texts, self._read[hook.session] = self.providers.named(hook.provider).texts_written(self.config.root, hook.session, self._read.get(hook.session, FIRST_LOOK))
        return [TurnWritten(text=text, delta=text, turn_id=f"transcript:{hook.session}:{i}", final=True).placed(hook.session, environment.id, hook.provider, self.context.of(hook.session), hook.subagent) for i, text in enumerate(texts)]

    def missed(self, session: str, provider: str, until: float) -> list[str]:
        """The blocks no hook has read yet that were written before a moment, read on from where the hooks left off, so neither reads one twice."""
        with self._reading:
            texts, self._read[session] = self.providers.named(provider).texts_written_before(self.config.root, session, self._read.get(session, FIRST_LOOK), until)
        return texts
