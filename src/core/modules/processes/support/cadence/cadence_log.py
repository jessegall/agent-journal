import re

from core.modules.processes.support.output_folder import OutputFolder

CADENCE_FILE = "cadence"
GROWTHS_KEPT = 5
TICK_SECONDS = 10
BREAK_SECONDS = 3 * TICK_SECONDS
KEPT_LINE = re.compile(r"^\d+ \d+(\.\d+)?( \d+(\.\d+)?)*$")


class CadenceLog:
    """The times a run's output last grew, kept in its folder with the size seen and the time of the last look,
    so the cadence of a run is judged from what it printed and a break in the watching is not read as a pause.
    One line: the size, the time of the last look, then up to five growth times; a damaged line reads as empty."""

    def __init__(self, folder: OutputFolder) -> None:
        self.folder = folder

    def figure(self, process_id: int, position: int) -> int:
        return self.folder.part_bytes(process_id, position) + self.folder.cut_bytes(process_id, position)

    def growths(self, process_id: int) -> tuple[float, ...]:
        return self.kept(process_id)[2]

    def record(self, process_id: int, size: int, now: float) -> tuple[float, ...]:
        kept_size, looked_at, growths = self.kept(process_id)
        if now - looked_at > BREAK_SECONDS:
            growths = ()
        if size != kept_size:
            growths = (*growths, now)[-GROWTHS_KEPT:]
        self.folder.write(process_id, CADENCE_FILE, " ".join(str(value) for value in (size, now, *growths)))
        return growths

    def kept(self, process_id: int) -> tuple[int, float, tuple[float, ...]]:
        line = self.folder.text(process_id, CADENCE_FILE).strip()
        if not KEPT_LINE.match(line):
            return 0, 0.0, ()
        size, looked_at, *growths = line.split()
        return int(size), float(looked_at), tuple(float(growth) for growth in growths)
