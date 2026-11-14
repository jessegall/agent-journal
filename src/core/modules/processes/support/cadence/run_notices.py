import re

from core.modules.processes.models.enums.notice_type import NoticeType
from core.modules.processes.support.output_folder import OutputFolder
from core.modules.processes.support.process_nudges import SILENT_RUN_INTERVAL

NOTICES_FILE = "notices"
MOST_NOTICES = 3
REPEAT_SECONDS = SILENT_RUN_INTERVAL.count
TOTAL_LINE = re.compile(r"^total (\d+)$")
NOTICE_LINE = re.compile(r"^([a-z-]+) (\d+) (\d+(?:\.\d+)?)$")


class RunNotices:
    """The one record of the cadence notices a run was given, kept in its folder: the total, and for each type
    how often and when last. A type is not repeated within ten minutes, a run gets at most three notices in
    all, another type may come at once, and the stuck warning comes once until the run prints again; it warns
    of a stop, so it is not counted among the three and the three do not hold it back."""

    def __init__(self, folder: OutputFolder) -> None:
        self.folder = folder

    def allowed(self, process_id: int, notice: NoticeType, seconds: float) -> bool:
        total, counts = self.kept(process_id)
        if notice is NoticeType.FROZEN:
            return notice not in counts
        if total >= MOST_NOTICES:
            return False
        return notice not in counts or seconds - counts[notice][1] >= REPEAT_SECONDS

    def recorded(self, process_id: int, notice: NoticeType, seconds: float) -> None:
        total, counts = self.kept(process_id)
        count = counts[notice][0] if notice in counts else 0
        self.write(process_id, total + int(notice is not NoticeType.FROZEN), {**counts, notice: (count + 1, seconds)})

    def cleared(self, process_id: int) -> None:
        total, _ = self.kept(process_id)
        self.write(process_id, total, {})

    def clear_frozen(self, process_id: int) -> None:
        total, counts = self.kept(process_id)
        if NoticeType.FROZEN in counts:
            self.write(process_id, total, {notice: record for notice, record in counts.items() if notice is not NoticeType.FROZEN})

    def write(self, process_id: int, total: int, counts: dict[NoticeType, tuple[int, float]]) -> None:
        lines = [f"total {total}", *(f"{notice.value} {count} {last}" for notice, (count, last) in counts.items())]
        self.folder.write(process_id, NOTICES_FILE, "\n".join(lines))

    def kept(self, process_id: int) -> tuple[int, dict[NoticeType, tuple[int, float]]]:
        lines = self.folder.text(process_id, NOTICES_FILE).strip().splitlines()
        total = TOTAL_LINE.match(lines[0]) if lines else None
        if total is None:
            return 0, {}
        counts = {}
        for line in lines[1:]:
            match = NOTICE_LINE.match(line)
            if match is None or match.group(1) not in NoticeType._value2member_map_:
                return 0, {}
            counts[NoticeType(match.group(1))] = (int(match.group(2)), float(match.group(3)))
        return int(total.group(1)), counts
