from dataclasses import fields
from typing import Generic, TypeVar

from journal.http.counts import Counts
from journal.http.listed import Listed
from journal.http.listing import Listing
from journal.http.request import Request
from journal.http.response import Response
from journal.models.model import Model
from journal.repositories.repository import Repository

S = TypeVar("S", bound=Model)


class Controller(Generic[S]):
    """One per model: its list, one row, a new one and a change, over its repository as the request's environment sees it. A resource whose rows close says which are open; one that shows more than its fields says what in shown."""

    repository: Repository[S]
    timeline = False
    """A chat or a feed: its list pages strictly by id."""

    def index(self, request: Request) -> Response:
        return Response.json(self.listed(Listing.from_query(request.query)))

    def listed(self, listing: Listing) -> Listed:
        rows = self.rows()
        page = listing.listed(rows, self.is_open, self.timeline)
        return Listed(rows=self.shown_page(page["rows"]), more=page["more"], counts=self.counts(rows))

    def rows(self) -> list[S]:
        """The rows a list is taken from: the newest page of them."""
        return self.repository.all()

    def is_open(self, row: S) -> bool:
        """Whether the row still asks for something; a resource whose rows never close keeps every one open."""
        return True

    def counts(self, rows: list[S]) -> Counts:
        return Counts(all=len(rows), open=len([row for row in rows if self.is_open(row)]), unread=0)

    def shown(self, row: S) -> object:
        """The row as the API answers it: its own fields, unless the resource names more beside them."""
        return self.shown_page([row])[0]

    def shown_page(self, rows: list[S]) -> list:
        """A page of rows as the API answers them; a resource that names more beside their fields reads it once for the page."""
        return list(rows)

    def show(self, request: Request) -> Response:
        return Response.json(self.shown(self.repository.find(request.number("id"))))

    def store(self, request: Request) -> Response:
        row = self.repository.model(**self.fields_of(request.body))
        return Response.json(self.shown(self.repository.save(row, request.actor)), 201)

    def update(self, request: Request) -> Response:
        row = self.repository.find(request.number("id"))
        return Response.json(self.shown(self.repository.save(row.with_(**self.fields_of(request.body)), request.actor)))

    def delete(self, request: Request) -> Response:
        self.repository.delete(self.repository.find(request.number("id")), request.actor)
        return Response.json({})

    def fields_of(self, body: dict) -> dict:
        """Only the model's own fields, never its id, its stamps or its state, which moves only by its own actions."""
        own = {f.name for f in fields(self.repository.model)} - {"id", "environment_id", "created_at", "created_by", "updated_at", "updated_by", "state"}
        return {name: value for name, value in body.items() if name in own}
