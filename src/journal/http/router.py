import time
from urllib.parse import unquote

from journal.features.faults.slow_requests import SlowRequests

from journal.support.refused import Refused
from journal.support.not_found import NotFound
from journal.http.request import Request
from journal.http.response import Response
from journal.http.route import Handler, Route
from journal.http.viewer_seen import ViewerSeen
from journal.support.scope import Scope


class Router:
    """Finds the route a request takes and answers it inside the environment the request names."""

    def __init__(self, scope: Scope, seen: ViewerSeen, slow: SlowRequests) -> None:
        self.scope, self.seen, self.slow = scope, seen, slow
        self.routes: list[Route] = []

    def get(self, path: str, handler: Handler) -> None:
        self.routes.append(Route("GET", path, handler))

    def post(self, path: str, handler: Handler) -> None:
        self.routes.append(Route("POST", path, handler))

    def dispatch(self, request: Request) -> Response:
        self.seen.saw(request.headers)
        for route in self.routes:
            params = route.params(request.method, request.path)
            if params is not None:
                try:
                    with self.scope.requested(lambda: request.environment):
                        began = time.perf_counter()
                        answer = route.handler(request.with_params({name: unquote(value) for name, value in params.items()}))
                        self.slow.measured(request.method, request.path, (time.perf_counter() - began) * 1000)
                        return answer
                except Refused as refused:
                    return Response.refused(str(refused))
                except NotFound as missing:
                    return Response.missing(missing)
        return Response.not_found(f"{request.method} {request.path}")
