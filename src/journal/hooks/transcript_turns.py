from journal.config import Config
from journal.events.agent.turn_written import TurnWritten
from journal.hooks.context_file import ContextFile
from journal.hooks.hook import Hook
from journal.hooks.hook_kind import HookKind
from journal.models.environment import Environment
from journal.providers.providers import Providers

FIRST_LOOK = -1
"""Where a session's transcript is read from before it was ever read: its end."""


class TranscriptTurns:
    """The text blocks an agent writes before a tool call never reach the display hook, which brings only a turn's last block; so at every other hook the agent's transcript is read from where it was left, and each block written since becomes a whole turn of its own, before the hook's event is handled."""

    def __init__(self, config: Config, providers: Providers, context: ContextFile) -> None:
        self.config, self.providers, self.context = config, providers, context
        self._read: dict[str, int] = {}

    def events(self, hook: Hook, environment: Environment) -> list[TurnWritten]:
        if hook.kind == HookKind.MESSAGE_DISPLAY:
            return []
        texts, self._read[hook.session] = self.providers.named(hook.provider).texts_written(self.config.root, hook.session, self._read.get(hook.session, FIRST_LOOK))
        return [TurnWritten(text=text, delta=text, turn_id=f"transcript:{hook.session}:{i}", final=True).placed(hook.session, environment.id, hook.provider, self.context.of(hook.session), hook.subagent) for i, text in enumerate(texts)]
