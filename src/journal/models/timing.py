from dataclasses import dataclass
from typing import ClassVar

from journal.models.model import Model
from journal.models.support.request_loads import RequestLoads


@dataclass(frozen=True)
class Timing(Model):
    """One request's time to answer, where the journal develops itself: the method (HOOK, GET or POST), the route or the command, the milliseconds, the moment, and the rows it loaded while load counting was on; every request writes one, so it is in no timeline."""

    shared: ClassVar[bool] = False

    timeline_visible: ClassVar[bool] = False

    method: str = ""
    route: str = ""
    ms: int = 0
    time: float = 0.0
    loads: RequestLoads = RequestLoads()

    def label(self) -> str:
        return self.route.rsplit("/", 1)[-1] if self.method == "HOOK" else f"{self.method} {self.route}"

    def load_line(self) -> str:
        return f"{self.label()}: {self.loads.line()}, {self.ms} ms"
