from core.base.container import Container


class RoundWork:
    """The base of the work one round of a server thread does on a fresh synced journal."""

    def run(self, container: Container) -> None:
        raise NotImplementedError
