from journal.http.request import Request
from journal.http.response import Response
from journal.repositories.environments import Environments


class EnvironmentController:
    def __init__(self, environments: Environments) -> None:
        self.environments = environments

    def index(self, request: Request) -> Response:
        return Response.json(self.environments.all() or [self.environments.named("main")])

    def store(self, request: Request) -> Response:
        return Response.json(self.environments.named(request.body.get("name", "main")), 201)
