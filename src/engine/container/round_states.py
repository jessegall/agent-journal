from engine.container.container import Container
from engine.container.round_state import RoundState


class RoundStates:
    """The round-state services a container has already built, in the order it built them; it builds none."""

    def __init__(self, container: Container) -> None:
        self.container = container

    def services(self) -> tuple[RoundState, ...]:
        return tuple({id(instance): instance for instance in self.container.instances.values() if isinstance(instance, RoundState)}.values())

    def reset(self) -> None:
        for service in self.services():
            service.reset()
