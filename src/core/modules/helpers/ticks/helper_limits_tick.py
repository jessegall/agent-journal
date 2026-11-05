from core.base.actor import Actor
from core.base.command.bus import Bus
from core.base.container import Container
from core.modules.helpers.commands.enforce_helper_limits.enforce_helper_limits import EnforceHelperLimits


class HelperLimitsTick:
    """Checks each helper against its limits, with no agent needed to carry it."""

    def __call__(self, container: Container) -> None:
        container.get(Bus).run(EnforceHelperLimits(), Actor.core())
