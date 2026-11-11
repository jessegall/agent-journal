import re

from core.modules.processes.models.enums.notice_kind import NoticeKind
from core.modules.processes.support.output_folder import OutputFolder
from core.modules.processes.support.process_nudges import SILENT_RUN_INTERVAL

NOTICES_FILE = "notices"
MOST_NOTICES = 3
REPEAT_SECONDS = SILENT_RUN_INTERVAL.count
TOTAL_LINE = re.compile(r"^total (\d+)$")
KIND_LINE = re.compile(r"^([a-z-]+) (\d+) (\d+(?:\.\d+)?)$")


class RunNotices:
    """The one record of the cadence notices a run was given, kept in its folder: the total, and for each kind
    how often and when last. A kind is not repeated within ten minutes, a run gets at most three notices in
    all, another kind may come at once, and the stuck warning comes once until the run prints again."""

    def __init__(self, folder: OutputFolder) -> None:
        self.folder = folder

    def allowed(self, process_id: int, kind: NoticeKind, now: float) -> bool:
        total, kinds = self.kept(process_id)
        if total >= MOST_NOTICES:
            return False
        if kind not in kinds:
            return True
        return kind is not NoticeKind.FROZEN and now - kinds[kind][1] >= REPEAT_SECONDS

    def recorded(self, process_id: int, kind: NoticeKind, now: float) -> None:
        total, kinds = self.kept(process_id)
        count = kinds[kind][0] if kind in kinds else 0
        self.write(process_id, total + 1, {**kinds, kind: (count + 1, now)})

    def cleared(self, process_id: int) -> None:
        total, _ = self.kept(process_id)
        self.write(process_id, total, {})

    def write(self, process_id: int, total: int, kinds: dict[NoticeKind, tuple[int, float]]) -> None:
        lines = [f"total {total}", *(f"{kind.value} {count} {last}" for kind, (count, last) in kinds.items())]
        self.folder.write(process_id, NOTICES_FILE, "\n".join(lines))

    def kept(self, process_id: int) -> tuple[int, dict[NoticeKind, tuple[int, float]]]:
        lines = self.folder.text(process_id, NOTICES_FILE).strip().splitlines()
        total = TOTAL_LINE.match(lines[0]) if lines else None
        if total is None:
            return 0, {}
        kinds = {}
        for line in lines[1:]:
            match = KIND_LINE.match(line)
            if match is None or match.group(1) not in NoticeKind._value2member_map_:
                return 0, {}
            kinds[NoticeKind(match.group(1))] = (int(match.group(2)), float(match.group(3)))
        return int(total.group(1)), kinds
