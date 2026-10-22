from dataclasses import dataclass

from journal.http.support.file_response import FileResponse

SANDBOX = {"Content-Security-Policy": "sandbox", "X-Content-Type-Options": "nosniff"}


@dataclass(frozen=True)
class SandboxedFileResponse(FileResponse):
    """A stored file's bytes, sent so that a page or picture opened from its address runs nothing in the journal's origin."""

    def headers(self) -> dict:
        return SANDBOX
