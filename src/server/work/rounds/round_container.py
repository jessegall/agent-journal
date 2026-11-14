from engine.container.container import Container


class RoundContainer:
    """The base of what hands a server round its container and hears when the round ends or fails."""

    def round_container(self) -> Container:
        raise NotImplementedError

    def ended_round(self, work_name: str) -> None:
        raise NotImplementedError

    def failed(self, error: BaseException, work_name: str) -> None:
        raise NotImplementedError

    def close(self) -> None:
        raise NotImplementedError
