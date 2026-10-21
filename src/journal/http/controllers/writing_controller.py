from typing import TypeVar

from journal.http.controllers.controller import Controller
from journal.http.row_list import RowList
from journal.http.listing import Listing
from journal.http.support.download_response import DownloadResponse
from journal.http.support.model_fields import ModelFields
from journal.http.support.request import Request
from journal.support.response import Response
from journal.models.model import Model
from journal.support.docx_export import DocxExport

W = TypeVar("W", bound=Model)


class WritingController(Controller[W]):
    """What documents and reports share: a list carries each without its body, which is asked for by id, and each names the rows it links to; a section is added at the end of the body."""

    def listed(self, listing: Listing) -> RowList:
        if listing.ids:
            return super().listed(listing)
        rows = self.rows()
        page = listing.listed(rows, self.is_open)
        linked = self.repository.linked_rows()
        return RowList(rows=[self.summarised(row, linked) for row in page["rows"]], is_last_page=page["is_last_page"], counts=self.counts(rows))

    def shown_page(self, rows: list[W]) -> list[dict]:
        linked = self.repository.linked_rows()
        return [{**ModelFields.build(row), "links": self.links(row, linked)} for row in rows]

    def summarised(self, row: W, linked: dict) -> dict:
        return {**{name: value for name, value in ModelFields.build(row).items() if name != "body"}, "links": self.links(row, linked)}

    @staticmethod
    def links(row: W, linked: dict) -> list[str]:
        return [str(ref) for ref in linked.get(row.id, [])]

    def export(self, request: Request) -> DownloadResponse:
        row = self.repository.find(request.number("id"))
        exported = DocxExport.build(row.title, row.abstract, row.body, f"{row.noun()} {row.id}")
        return DownloadResponse(exported.kind, exported.body, name=exported.name)

    def section(self, request: Request) -> Response:
        row = self.repository.find(request.number("id"))
        body = f"{row.body.rstrip()}\n\n## {request.body.get('title', '')}\n\n{request.body.get('body', '')}\n"
        return Response.json(self.shown(self.repository.save(row.with_(body=body), request.actor)))
