from dataclasses import dataclass

from core.modules.drivers.commands.support.wake_agent import WakeAgent


@dataclass(frozen=True)
class WakeCompactedAgent(WakeAgent):
    """Gives an agent left at its prompt by a compaction the line that it goes on with its work, and types it
    into its terminal."""
