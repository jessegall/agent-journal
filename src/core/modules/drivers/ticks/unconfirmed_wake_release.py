from engine.container.container import Container
from engine.module.module_actors import ModuleActors
from core.modules.drivers.support.driver_settings import MODULE_KEY
from core.modules.drivers.support.wake_delivery import WakeDelivery


class UnconfirmedWakeRelease:
    """Puts back a line given to a wake waiter that never confirmed it, so a waiter that died after the claim
    loses no line."""

    def __call__(self, container: Container) -> None:
        container.get(WakeDelivery).release_unconfirmed(container.get(ModuleActors).actor(MODULE_KEY))
