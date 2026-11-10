from engine.actor.actor import Actor
from core.base.command.bus import Bus
from engine.container.container import Container
from core.modules.drivers.commands.end_silent_helpers.end_silent_helpers import EndSilentHelpers


class EndSilentHelpersTick:
    """Ends helpers that went silent, on a tick of its own, so it runs with no agent alive to carry it."""

    def __call__(self, container: Container) -> None:
        container.get(Bus).run(EndSilentHelpers(), Actor.core())
