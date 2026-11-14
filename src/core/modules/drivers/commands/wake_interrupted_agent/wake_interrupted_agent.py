from dataclasses import dataclass

from core.modules.drivers.commands.support.wake_agent import WakeAgent


@dataclass(frozen=True)
class WakeInterruptedAgent(WakeAgent):
    """Gives an agent whose turn was interrupted the line that it goes on with its work, and types it into its
    terminal."""
