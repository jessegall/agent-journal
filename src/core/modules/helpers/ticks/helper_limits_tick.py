from core.base.actor import Actor
from core.base.command.bus import Bus
from core.base.container import Container
from core.modules.helpers.commands.end_helpers_past_limits.end_helpers_past_limits import EndHelpersPastLimits


class HelperLimitsTick:
    """Checks each helper against its limits, with no agent needed to carry it."""

    def __call__(self, container: Container) -> None:
        container.get(Bus).run(EndHelpersPastLimits(), Actor.core())
