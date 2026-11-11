from engine.journal.journal_home import JournalHome
from engine.module.driver_entries import DRIVERS_MODULE
from engine.provider.context_window import ContextWindow
from engine.provider.providers import Providers
from engine.time.timestamp import Timestamp
from core.modules.agents.models.agent import Agent

COMPACTION_ENDED_AT = "compaction_ended_at"
UNKNOWN_WINDOW = ContextWindow(None, None)


class CurrentContextWindow:
    """The context reading of an agent that counts. A program rewrites its status file some time after a
    compaction ends, so until then the file holds the size from before the compaction. A reading written
    before the end of the agent's newest compaction, or one that says no time, is unknown."""

    def __init__(self, providers: Providers, home: JournalHome) -> None:
        self.providers, self.home = providers, home

    def window(self, agent: Agent) -> ContextWindow:
        window = self.providers.provider(agent.program).context_window(self.home, agent.session)
        return window if self.is_current(agent, window) else UNKNOWN_WINDOW

    def is_unknown(self, agent: Agent) -> bool:
        return not self.is_current(agent, self.providers.provider(agent.program).context_window(self.home, agent.session))

    @classmethod
    def is_current(cls, agent: Agent, window: ContextWindow) -> bool:
        return cls.is_read_after(agent.metadata.module_part(DRIVERS_MODULE).get(COMPACTION_ENDED_AT), window)

    @staticmethod
    def is_read_after(compaction_end: object, window: ContextWindow) -> bool:
        if not isinstance(compaction_end, str):
            return True
        return window.read_at is not None and Timestamp.parsed(compaction_end).elapsed_seconds(window.read_at) > 0
