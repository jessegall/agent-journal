from dataclasses import dataclass, field
from urllib.parse import quote

from journal.http.support.file_response import FileResponse


@dataclass(frozen=True)
class DownloadResponse(FileResponse):
    """A file sent to be saved under its name, as an attachment."""

    name: str = field(kw_only=True)

    def headers(self) -> dict:
        return {"Content-Disposition": f"attachment; filename*=UTF-8''{quote(self.name)}"}
