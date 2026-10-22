from typing import TypedDict

from journal.http.attachments.attached_file import AttachedFile


class FileView(TypedDict):
    """One page of the attached files, how many the search found, whether more follow, and how many there are of each kind."""

    files: list[AttachedFile]
    is_last_page: bool
    total: int
    counts: dict
