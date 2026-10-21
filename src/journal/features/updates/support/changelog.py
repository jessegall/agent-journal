import re
from pathlib import Path

from journal.features.updates.support.changelog_page import ChangelogPage

RELEASE = re.compile(r"^## ", re.M)
PAGE_RELEASES = 10


class Changelog:
    """What each release brought, as the package carries it in CHANGELOG.md, read a page of releases at a time with the heading above the first page."""

    def __init__(self) -> None:
        self.path = Path(__file__).resolve().parents[3] / "CHANGELOG.md"

    def page(self, omit: int) -> ChangelogPage:
        text = self.path.read_text() if self.path.is_file() else ""
        starts = [rows.start() for rows in RELEASE.finditer(text)]
        ends = [*starts[1:], len(text)]
        stop = min(omit + PAGE_RELEASES, len(starts))
        first = starts[0] if starts else len(text)
        heading = text[:first] if omit == 0 else ""
        return ChangelogPage(heading + (text[starts[omit]:ends[stop - 1]] if omit < stop else ""), stop, stop < len(starts))
