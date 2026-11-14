from dataclasses import dataclass

from core.modules.drivers.commands.support.wake_agent import WakeAgent


@dataclass(frozen=True)
class WakeSafeguardsStoppedAgent(WakeAgent):
    """Gives an agent whose turn an API safeguards error ended the line to go on with its work, and types it into
    its terminal."""
