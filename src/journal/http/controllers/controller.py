from dataclasses import fields
from typing import Generic, TypeVar

from journal.http.request import Request
from journal.http.response import Response
from journal.models.scoped import Scoped
from journal.repositories.environments import Environments
from journal.repositories.not_found import NotFound
from journal.repositories.scoped_repository import ScopedRepository

S = TypeVar("S", bound=Scoped)


class Controller(Generic[S]):
    """One per model: index, show, store and update over its repository, within the request's environment."""

    repository: ScopedRepository[S]
    environments: Environments

    PAGE = 50

    def index(self, request: Request) -> Response:
        """A page, newest first: ?limit= caps it and ?before=<id> asks for older rows."""
        return Response.json(self.repository.page_in(self.environment_id(request), self.limit(request), self.before(request)))

    def limit(self, request: Request) -> int:
        return min(int(request.query.get("limit", self.PAGE)), 500)

    @staticmethod
    def before(request: Request) -> int | None:
        return int(request.query["before"]) if request.query.get("before") else None

    def show(self, request: Request) -> Response:
        try:
            return Response.json(self.repository.find(int(request.params["id"])))
        except NotFound as missing:
            return Response.not_found(str(missing))

    def store(self, request: Request) -> Response:
        row = self.repository.model(environment_id=self.environment_id(request), **self.fields_of(request.body))
        return Response.json(self.repository.save(row, request.actor), 201)

    def update(self, request: Request) -> Response:
        try:
            row = self.repository.find(int(request.params["id"]))
        except NotFound as missing:
            return Response.not_found(str(missing))
        return Response.json(self.repository.save(row.with_(**self.fields_of(request.body)), request.actor))

    def environment_id(self, request: Request) -> int:
        return self.environments.existing(request.environment).id

    def fields_of(self, body: dict) -> dict:
        """Only the model's own fields, never its id or its stamps."""
        own = {f.name for f in fields(self.repository.model)} - {"id", "environment_id", "created_at", "created_by", "updated_at", "updated_by"}
        return {name: value for name, value in body.items() if name in own}
