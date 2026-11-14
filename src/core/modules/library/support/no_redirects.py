import urllib.request
from email.message import Message
from typing import IO


class NoRedirects(urllib.request.HTTPRedirectHandler):
    """Follows no redirect, since urllib would carry the token to wherever the answer points."""

    def redirect_request(self, req: urllib.request.Request, fp: IO[bytes], code: int, msg: str, headers: Message, newurl: str) -> None:
        return None
