import time
from urllib.parse import unquote

from journal.features.faults.support.slow_requests import SlowRequests

from journal.support.rejection import Rejection
from journal.support.missing_row import MissingRow
from journal.http.support.request import Request
from journal.support.response import Response
from journal.http.support.route import Handler, Route
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
        return next((route for route in self.routes if route.params(request.method, request.path) is not None), None)

    def dispatch(self, request: Request) -> Response:
        self.presence.record(request.headers)
        route = self.matched(request)
        if route is None:
            return Response.absent(f"{request.method} {request.path}")
        try:
            with self.scope.requested(lambda: request.environment):
                began = time.perf_counter()
                answer = route.handler(request.with_params({name: unquote(value) for name, value in route.params(request.method, request.path).items()}))
                if not route.outward:
                    self.slow.measured(request.method, request.measured_path(), (time.perf_counter() - began) * 1000)
                return answer
        except Rejection as refused:
            return Response.refused(str(refused))
        except MissingRow as missing:
            return Response.missing(missing)
