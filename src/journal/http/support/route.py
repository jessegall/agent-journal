import re
from dataclasses import dataclass
from typing import Callable

from journal.http.support.request import Request
from journal.support.response import Response

Handler = Callable[[Request], Response]


@dataclass(frozen=True)
class Route:
    """One method and path pattern, such as POST /tasks/{id}/start, and what answers it."""

    method: str
    pattern: str
    handler: Handler
    outward: bool = False
    """Its answer waits on a server outside the journal, so its time is the network's and never judged against a budget."""

    def params(self, method: str, path: str) -> dict | None:
        """The named parts when this route matches, None when it does not."""
        if method != self.method:
            return None
        regex = "^" + re.sub(r"\{(\w+)\}", r"(?P<\1>[^/]+)", re.escape(self.pattern).replace("\\{", "{").replace("\\}", "}")) + "$"
        match = re.match(regex, path)
        return match.groupdict() if match else None
