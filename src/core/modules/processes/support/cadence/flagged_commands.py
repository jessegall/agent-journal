from core.modules.processes.models.enums.notice_type import NoticeType
from core.modules.processes.support.unreadable.unreadable_mark_registry import UnreadableMarkRegistry


class FlaggedCommands:
    """The one place the cadence asks about marks: a command marked unreadable gets no notice that it prints
    nothing or too seldom, and is still told when it stopped writing or seems stuck."""

    def __init__(self, marks: UnreadableMarkRegistry) -> None:
        self.marks = marks

    def skips(self, category: NoticeType, command_key: str) -> bool:
        return category.concerns_reading and self.marks.excuses(command_key)
