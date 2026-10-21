from urllib.parse import unquote

from journal.features.faults.support.slow_requests import SlowRequests

from journal.support.rejection import Rejection
from journal.support.missing_row import MissingRow
from journal.http.support.file_response import FileResponse
from journal.http.support.request import Request
from journal.http.support.stream_response import StreamResponse
from journal.support.response import Response
from journal.http.support.route import Answer, Handler, Route
from journal.http.support.viewer_presence import ViewerPresence
from journal.repositories.scope import Scope


class Router:
    """Finds the route a request takes and answers it inside the environment the request names."""

    def __init__(self, scope: Scope, presence: ViewerPresence, slow: SlowRequests) -> None:
        self.scope, self.presence, self.slow = scope, presence, slow
        self.routes: list[Route] = []

    def get(self, path: str, handler: Handler) -> None:
        self.routes.append(Route("GET", path, handler))

    def post(self, path: str, handler: Handler) -> None:
        self.routes.append(Route("POST", path, handler))

    def get_outward(self, path: str, handler: Handler) -> None:
        self.routes.append(Route("GET", path, handler, outward=True))

    def matched(self, request: Request) -> Route | None:
        matching = self.match(request)
        return None if matching is None else matching[0]

    def match(self, request: Request) -> tuple[Route, dict[str, str]] | None:
        return next(((route, params) for route in self.routes if (params := route.params(request.method, request.path)) is not None), None)

    def page(self, request: Request) -> Response | FileResponse:
        answer = self.route(request)
        return Response.refused(f"{request.method} {request.path} streams, so it is no page") if isinstance(answer, StreamResponse) else answer

    def route(self, request: Request) -> Answer:
        self.presence.record(request.headers)
        matching = self.match(request)
        if matching is None:
            return Response.absent(f"{request.method} {request.path}")
        route, params = matching
        try:
            with self.scope.requested(lambda: request.environment):
                if route.outward:
                    return route.handler(request.with_params({name: unquote(value) for name, value in params.items()}))
                timer = self.slow.begin()
                answer = route.handler(request.with_params({name: unquote(value) for name, value in params.items()}))
                self.slow.measured(request.method, request.measured_path(), timer.wall_ms(), timer.cpu_ms())
                return answer
        except Rejection as refused:
            return Response.refused(str(refused))
        except MissingRow as missing:
            return Response.missing(missing)
