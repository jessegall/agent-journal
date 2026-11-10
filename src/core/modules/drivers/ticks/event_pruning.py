from engine.actor.actor import Actor
from core.base.command.bus import Bus
from engine.container.container import Container
from core.modules.drivers.commands.prune_events.prune_events import PruneEvents


class EventPruning:
    """One batch of the logged changes of short-lived rows is deleted."""

    def __call__(self, container: Container) -> None:
        container.get(Bus).run(PruneEvents(), Actor.core())
