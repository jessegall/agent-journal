import re

from core.modules.processes.support.output_folder import OutputFolder
from core.modules.processes.support.cadence.run_cadence import GROWTHS_KEPT

CADENCE_FILE = "cadence"
TICK_SECONDS = 10
BREAK_SECONDS = 3 * TICK_SECONDS
KEPT_LINE = re.compile(r"^\d+ \d+(\.\d+)? \d+(\.\d+)?( \d+(\.\d+)?)*$")


class CadenceLog:
    """The times a run's output last grew, kept in its folder with the size seen and the time of the
    last look, so the cadence of a run is judged from what it printed and a break in the watching is
    not read as a pause: after a break the times start again and the time the watching resumed is
    kept, so the run is judged from then. One line: the size, the time of the last look, the time
    the watching resumed (0 when it never broke), then up to five growth times; a damaged line reads
    as empty."""

    def __init__(self, folder: OutputFolder) -> None:
        self.folder = folder

    def figure(self, process_id: int, position: int) -> int:
        return self.folder.part_bytes(process_id, position) + self.folder.cut_bytes(process_id, position)

    def growths(self, process_id: int) -> tuple[float, ...]:
        return self.kept(process_id)[3]

    def resumed(self, process_id: int) -> float:
        return self.kept(process_id)[2]

    def record(self, process_id: int, size: int, now: float) -> tuple[float, ...]:
        kept_size, looked_at, resumed, growths = self.kept(process_id)
        if looked_at and now - looked_at > BREAK_SECONDS:
            growths, resumed = (), now
        if size != kept_size:
            growths = (*growths, now)[-GROWTHS_KEPT:]
        self.folder.write(process_id, CADENCE_FILE, " ".join(str(value) for value in (size, now, resumed, *growths)))
        return growths

    def kept(self, process_id: int) -> tuple[int, float, float, tuple[float, ...]]:
        line = self.folder.text(process_id, CADENCE_FILE).strip()
        if not KEPT_LINE.match(line):
            return 0, 0.0, 0.0, ()
        size, looked_at, resumed, *growths = line.split()
        return int(size), float(looked_at), float(resumed), tuple(float(growth) for growth in growths)
