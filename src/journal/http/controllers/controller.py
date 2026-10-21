from dataclasses import fields
from typing import Generic, TypeVar

from journal.http.counts import Counts
from journal.http.row_list import RowList
from journal.http.listing import Listing
from journal.http.support.request import Request
from journal.support.response import Response
from journal.models.model import Model
from journal.repositories.repository import Repository

S = TypeVar("S", bound=Model)


class Controller(Generic[S]):
    """One per model: its list, one row, a new one and a change, over its repository as the request's environment sees it. A resource whose rows close says which are open; one that shows more than its fields says what in shown."""

    repository: Repository[S]
    timeline = False

    def index(self, request: Request) -> Response:
        return Response.json(self.listed(Listing.query_listing(request.query)))

    def listed(self, listing: Listing) -> RowList:
        rows = self.rows()
        page = listing.listed(rows, self.is_open, self.timeline)
        return RowList(rows=self.shown_page(page["rows"]), more=page["more"], counts=self.counts(rows))

    def rows(self) -> list[S]:
        return self.repository.all()

    def is_open(self, row: S) -> bool:
        return True

    def counts(self, rows: list[S]) -> Counts:
        return Counts(all=len(rows), open=len([row for row in rows if self.is_open(row)]), unread=0)

    def shown(self, row: S) -> object:
        return self.shown_page([row])[0]

    def shown_page(self, rows: list[S]) -> list:
        return list(rows)

    def show(self, request: Request) -> Response:
        return Response.json(self.shown(self.repository.find(request.number("id"))))

    def store(self, request: Request) -> Response:
        row = self.repository.model(**self.fields(request.body))
        return Response.json(self.shown(self.repository.save(row, request.actor)), 201)

    def update(self, request: Request) -> Response:
        row = self.repository.find(request.number("id"))
        return Response.json(self.shown(self.repository.save(row.with_(**self.fields(request.body)), request.actor)))

    def delete(self, request: Request) -> Response:
        self.repository.delete(self.repository.find(request.number("id")), request.actor)
        return Response.json({})

    def fields(self, body: dict) -> dict:
        owned = {f.name for f in fields(self.repository.model)} - {"id", "environment_id", "created_at", "created_by", "updated_at", "updated_by", "state"}
        return {name: value for name, value in body.items() if name in owned}
