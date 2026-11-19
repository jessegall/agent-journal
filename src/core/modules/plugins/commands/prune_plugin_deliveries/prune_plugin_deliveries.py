from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class PrunePluginDeliveries(Command[int]):
    """Deletes plugin deliveries older than the kept days, beyond the newest kept for each plugin. It reads every
    delivery, so it takes no lock: each delete is its own short write, and nothing else deletes a delivery."""
