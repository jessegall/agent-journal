from typing import Callable

from journal.http.request import Request
from journal.http.response import Response

Handler = Callable[[Request], Response]


class Router:
    def __init__(self) -> None: ...

    def get(self, path: str, handler: Handler) -> None: ...

    def post(self, path: str, handler: Handler) -> None: ...

    def dispatch(self, request: Request) -> Response: ...
