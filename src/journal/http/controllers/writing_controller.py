from typing import TypeVar

from journal.http.controllers.controller import Controller
from journal.http.listed import Listed
from journal.http.listing import Listing
from journal.http.model_fields import ModelFields
from journal.http.request import Request
from journal.http.response import Response
from journal.models.model import Model

W = TypeVar("W", bound=Model)


class WritingController(Controller[W]):
    """What documents and reports share: a list carries each without its body, which is asked for by id, and each names the rows it links to; a section is added at the end of the body."""

    def listed(self, listing: Listing) -> Listed:
        if listing.ids:
            return super().listed(listing)
        rows = self.rows()
        page = listing.listed(rows, self.is_open)
        linked = self.repository.every_linked()
        return Listed(rows=[self.summarised(row, linked) for row in page["rows"]], more=page["more"], counts=self.counts(rows))

    def shown_page(self, rows: list[W]) -> list[dict]:
        linked = self.repository.every_linked()
        return [{**ModelFields.of(row), "links": self.links(row, linked)} for row in rows]

    def summarised(self, row: W, linked: dict) -> dict:
        """The row without its body, which a list leaves out."""
        return {**{name: value for name, value in ModelFields.of(row).items() if name != "body"}, "links": self.links(row, linked)}

    @staticmethod
    def links(row: W, linked: dict) -> list[str]:
        return [str(ref) for ref in linked.get(row.id, [])]

    def section(self, request: Request) -> Response:
        row = self.repository.find(request.number("id"))
        body = f"{row.body.rstrip()}\n\n## {request.body.get('title', '')}\n\n{request.body.get('body', '')}\n"
        return Response.json(self.shown(self.repository.save(row.with_(body=body), request.actor)))
