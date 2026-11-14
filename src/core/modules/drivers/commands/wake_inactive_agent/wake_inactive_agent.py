from dataclasses import dataclass

from core.modules.drivers.commands.support.wake_agent import WakeAgent


@dataclass(frozen=True)
class WakeInactiveAgent(WakeAgent):
    """Gives an idle agent a short line that asks for no work, so its prompt cache stays warm, and types it
    into its terminal."""
