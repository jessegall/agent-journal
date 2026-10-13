import json
import re
from dataclasses import dataclass
from pathlib import Path

from resources.runs import SHELL
from events.asking import ToolCallAsked
from controllers.types import Dumps
from serving import ReadFiles, Settings

READ = "Read"
PAGED = (".pdf", ".ipynb")
CAT = re.compile(r"(?:^|[;&|]\s*)cat\s+([^\s|;&<>-][^\s|;&<>]*)\s*(?=$|[;&])")
SEARCHED_LINES = 1 << 16


@dataclass(frozen=True)
class LongRead:
    """A whole read of a file longer than the limit: the file as the call named it, where it is, and how many lines it has."""

    named: str
    path: Path
    count: int
    whole: bool

    @property
    def instead(self) -> str:
        return "read a range (offset 1, limit 120)" if self.whole else f"print a range: sed -n '1,120p' {self.named}"

    @property
    def reason(self) -> str:
        return (f"{self.named} has {self.count:,} lines, too long to read whole (law L3, read narrowly). Instead: {self.instead}, then the next range; "
                f"or list its headings first with grep -n '^#' {self.named} and read only the part you need; or grep -n for the line you want.")


def lines_in(files: ReadFiles, path: Path) -> int:
    """The lines a text file has; none for a file read in pages, a binary one or one that cannot be read."""
    if path.suffix.lower() in PAGED:
        return 0
    try:
        text = files.read(str(path))
    except (OSError, UnicodeDecodeError):
        return 0
    return 0 if "\0" in text[:SEARCHED_LINES] else text.count("\n")


def printed_whole(event: ToolCallAsked) -> tuple[str, bool]:
    """The file a call prints in full, as the call names it, and whether the call is a whole read rather than a cat."""
    if event.tool == SHELL:
        cat = CAT.search(event.input)
        return (cat.group(1) if cat else ""), False
    given = json.loads(event.input) if event.tool == READ else {}
    whole = "offset" not in given and "limit" not in given
    return (given.get("file_path", "") if whole else ""), whole


def long_read(event: ToolCallAsked, settings: Settings, files: ReadFiles, dumps: Dumps) -> LongRead | None:
    named, whole = printed_whole(event)
    if not named:
        return None
    path = Path(named).expanduser()
    path = Path(event.cwd) / path if event.cwd else path
    if dumps.holds(path):
        return None
    count = lines_in(files, path)
    return LongRead(named, path, count, whole) if count > int(settings.whole_read_lines) else None
