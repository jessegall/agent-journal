import re
from dataclasses import dataclass
from typing import Callable

from journal.http.support.file_response import FileResponse
from journal.http.support.request import Request
from journal.http.support.stream_response import StreamResponse
from journal.support.response import Response

Answer = Response | FileResponse | StreamResponse
Handler = Callable[[Request], Answer]


@dataclass(frozen=True)
class Route:
    """One method and path pattern, such as POST /tasks/{id}/start, and what answers it; an unscoped one, such as the sign-in, runs in no environment."""

    method: str
    pattern: str
    handler: Handler
    outward: bool = False
    scoped: bool = True

    def params(self, method: str, path: str) -> dict[str, str] | None:
        if method != self.method:
            return None
        regex = "^" + re.sub(r"\{(\w+)\}", r"(?P<\1>[^/]+)", re.escape(self.pattern).replace("\\{", "{").replace("\\}", "}")) + "$"
        match = re.match(regex, path)
        return match.groupdict() if match else None
