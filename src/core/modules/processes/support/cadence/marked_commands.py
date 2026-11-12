from core.modules.processes.models.enums.notice_kind import NoticeKind
from core.modules.processes.support.unreadable.unreadable_marks import UnreadableMarks


class MarkedCommands:
    """The one place the cadence asks about marks: a command marked unreadable gets no notice that it prints
    nothing or too seldom, and is still told when it stopped writing or seems stuck."""

    def __init__(self, marks: UnreadableMarks) -> None:
        self.marks = marks

    def skips(self, kind: NoticeKind, command_key: str) -> bool:
        return kind.is_about_reading and self.marks.excuses(command_key)
