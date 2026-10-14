from journal.http.request import Request
from journal.http.response import Response


class Controller:
    """One per model: turns a request into repository calls and a response."""

    def index(self, request: Request) -> Response: ...

    def show(self, request: Request) -> Response: ...

    def store(self, request: Request) -> Response: ...

    def update(self, request: Request) -> Response: ...
