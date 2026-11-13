from core.modules.processes.support.output_folder import OutputFolder
from core.modules.processes.support.cadence.cadence_line import CadenceLine

CADENCE_FILE = "cadence"


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
        return self.kept(process_id).growths

    def resumed(self, process_id: int) -> float:
        return self.kept(process_id).resumed

    def record(self, process_id: int, size: int, current_time: float) -> tuple[float, ...]:
        line = self.kept(process_id).looked(size, current_time)
        self.folder.write(process_id, CADENCE_FILE, line.text())
        return line.growths

    def kept(self, process_id: int) -> CadenceLine:
        return CadenceLine.read(self.folder.text(process_id, CADENCE_FILE).strip())
