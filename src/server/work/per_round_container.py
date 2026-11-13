from collections.abc import Callable

from engine.container.container import Container
from engine.database.database import Database
from engine.journal.journal_home import JournalHome
from server.work.kept_round_container import background_container
from server.work.round_container import RoundContainer


class PerRoundContainer(RoundContainer):
    """A container built for one round and closed when the round ends, for a round that runs once or a tick
    handler's round."""

    def __init__(self, home: JournalHome, container: Callable[[JournalHome], Container] = background_container) -> None:
        self.home = home
        self.container = container
        self.open_containers: list[Container] = []

    def round_container(self) -> Container:
        container = self.container(self.home)
        self.open_containers.append(container)
        return container

    def ended_round(self, work_name: str) -> None:
        self.close()

    def failed(self, error: BaseException, work_name: str) -> None:
        pass

    def close(self) -> None:
        while self.open_containers:
            self.open_containers.pop().get(Database).close()
