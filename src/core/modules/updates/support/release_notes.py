import json
import re

from core.modules.updates.support.release_note import ReleaseNote
from core.modules.updates.support.release_note_page import ReleaseNotePage
from core.modules.updates.support.release_source import ReleaseSource

PAGE_SIZE = 10
GITHUB_REPOSITORY = re.compile(r"github\.com/([^/]+/[^/]+)/releases")


class ReleaseNotes:
    """What the published releases say changed, a page at a time, read from GitHub when the release address is
    there; any other address publishes no notes."""

    def __init__(self, source: ReleaseSource) -> None:
        self.source = source

    def page(self, number: int) -> ReleaseNotePage:
        repository = GITHUB_REPOSITORY.search(self.source.address())
        if repository is None:
            return ReleaseNotePage((), True)
        text, _ = self.source.fetched(f"https://api.github.com/repos/{repository[1]}/releases?per_page={PAGE_SIZE}&page={number}")
        rows = json.loads(text)
        return ReleaseNotePage(tuple(ReleaseNote(row["tag_name"], row["body"], row["published_at"]) for row in rows), len(rows) < PAGE_SIZE)
