from dataclasses import dataclass

from engine.agent_machine.contracts.rank_order import RankOrder
from engine.agent_machine.driver import Driver
from engine.enums.responder import Responder
from engine.enums.work_stop import WorkStop


@dataclass(frozen=True)
class DriverDeclaration:
    """A driver as sync compiles it: its name, agent type and suite, the drivers it gathers, its rank order, its
    work-stop contract (none when the class leaves it out, which sync refuses) and its responder."""

    name: str
    agent_type: str
    suite: str
    gathers: tuple[str, ...]
    rank_order: RankOrder
    work_stop: WorkStop | None
    responder: Responder

    @classmethod
    def of(cls, driver: type[Driver]) -> "DriverDeclaration":
        work_stop = driver.work_stop if hasattr(driver, "work_stop") else None
        return cls(driver.name, driver.agent_type, driver.suite, tuple(gathered.name for gathered in driver.gathers), driver.rank_order, work_stop, driver.responder)
