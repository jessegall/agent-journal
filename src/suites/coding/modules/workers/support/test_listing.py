from dataclasses import dataclass

from core.modules.processes.models.reader import Reader
from core.modules.processes.support.count_command import CountCommand

LISTING_MARK = "JOURNAL_COUNT_PART_"


@dataclass(frozen=True)
class TestListing:
    """The reader and listing command for one test part."""

    position: int
    reader: Reader
    command: str

    @property
    def line(self) -> str:
        return f"(printf '\\n{LISTING_MARK}{self.position}\\n'; {CountCommand.filled(self.reader.count_command, self.command)})"

    def output_text(self, text: str) -> str:
        marker = f"{LISTING_MARK}{self.position}\n"
        if marker not in text:
            return ""
        return text.split(marker, 1)[1].split(LISTING_MARK, 1)[0]
