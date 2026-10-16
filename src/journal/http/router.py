from urllib.parse import unquote

from journal.refused import Refused
from journal.repositories.not_found import NotFound
from journal.http.request import Request
from journal.http.response import Response
from journal.http.route import Handler, Route
from journal.repositories.scope import Scope


class Router:
    """Finds the route a request takes and answers it inside the environment the request names."""

    def __init__(self, scope: Scope) -> None:
        self.scope = scope
        self.routes: list[Route] = []

    def get(self, path: str, handler: Handler) -> None:
        self.routes.append(Route("GET", path, handler))

    def post(self, path: str, handler: Handler) -> None:
        self.routes.append(Route("POST", path, handler))

    def dispatch(self, request: Request) -> Response:
        for route in self.routes:
            params = route.params(request.method, request.path)
            if params is not None:
                try:
                    with self.scope.requested(lambda: request.environment):
                        return route.handler(request.with_params({name: unquote(value) for name, value in params.items()}))
                except Refused as refused:
                    return Response.refused(str(refused))
                except NotFound as missing:
                    return Response.not_found(str(missing))
        return Response.not_found(f"{request.method} {request.path}")
