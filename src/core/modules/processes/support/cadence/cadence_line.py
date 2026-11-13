import re
from dataclasses import dataclass

from core.modules.processes.support.cadence.run_cadence import GROWTHS_KEPT

TICK_SECONDS = 10
BREAK_SECONDS = 3 * TICK_SECONDS
KEPT_LINE = re.compile(r"^\d+ \d+(\.\d+)? \d+(\.\d+)?( \d+(\.\d+)?)*$")


@dataclass(frozen=True)
class CadenceLine:
    """The cadence kept for one run: the size of its output, the time of the last look, the time the watching
    resumed (0 when it never broke) and up to five times its output grew."""

    size: int = 0
    checked_at: float = 0.0
    resumed: float = 0.0
    growths: tuple[float, ...] = ()

    @classmethod
    def read(cls, line: str) -> "CadenceLine":
        if not KEPT_LINE.match(line):
            return cls()
        size, checked_at, resumed, *growths = line.split()
        return cls(int(size), float(checked_at), float(resumed), tuple(float(growth) for growth in growths))

    # This cadence after a look at size bytes now: after a break in the watching the times start again from now.
    def looked(self, size: int, current_time: float) -> "CadenceLine":
        growths, resumed = self.growths, self.resumed
        if self.checked_at and current_time - self.checked_at > BREAK_SECONDS:
            growths, resumed = (), current_time
        if size != self.size:
            growths = (*growths, current_time)[-GROWTHS_KEPT:]
        return CadenceLine(size, current_time, resumed, growths)

    def text(self) -> str:
        return " ".join(str(value) for value in (self.size, self.checked_at, self.resumed, *self.growths))
