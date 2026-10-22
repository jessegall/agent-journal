from journal.features.dumps.support.dump_filer import DumpFiler
from journal.sync.attachments import Attachments
from journal.http.controllers.controller import Controller
from journal.http.support.model_fields import ModelFields
from journal.http.support.request import Request
from journal.support.response import Response
from journal.models.dump import Dump
from journal.repositories.dumps import Dumps

class DumpController(Controller[Dump]):
    """What the viewer does to a dump: drop one, add files to it, answer its question, pick or decline its next steps, name it, stop, split or remove it; each with the rows it was filed into."""

    repository: Dumps

    def __init__(self, sorting: DumpFiler, dumps: Dumps, attachments: Attachments) -> None:
        self.filing, self.repository, self.attachments = sorting, dumps, attachments

    def rows(self) -> list[Dump]:
        return self.repository.scoped()

    def is_open(self, row: Dump) -> bool:
        return not row.is_completed

    def shown_page(self, rows: list[Dump]) -> list[dict]:
        filed = self.repository.linked_rows()
        return [{**ModelFields.build(d), "filed": list(dict.fromkeys(str(ref) for ref in filed.get(d.row_id, [])))} for d in rows]

    def store(self, request: Request) -> Response:
        return Response.json(self.shown(self.filing.create(str(request.body.get("brief", "")), request.actor)), 201)

    def attach(self, request: Request) -> Response:
        dump = self.repository.find(request.number("id"))
        for name, data in request.files.items():
            self.filing.attach(dump.row_id, self.attachments.store(Dump.table(), dump.row_id, name, data), request.actor)
        return Response.json(self.shown(self.repository.find(dump.row_id)))

    def choose(self, request: Request) -> Response:
        return self.finish(self.filing.choose(request.number("id"), int(request.body.get("pick", -1)), request.actor))

    def decline(self, request: Request) -> Response:
        return self.finish(self.filing.decline(request.number("id"), int(request.body.get("pick", -1)), request.actor))

    def direct(self, request: Request) -> Response:
        return self.finish(self.filing.direct(request.number("id"), str(request.body.get("how", "")), request.actor))

    def answer(self, request: Request) -> Response:
        return self.finish(self.filing.answer(request.number("id"), str(request.body.get("text", "")), request.actor))

    def name(self, request: Request) -> Response:
        return self.finish(self.filing.name(request.number("id"), str(request.body.get("title", "")), request.actor))

    def split(self, request: Request) -> Response:
        return self.finish(self.filing.split(request.number("id"), str(request.body.get("parts", "")), request.actor))

    def dismiss(self, request: Request) -> Response:
        return self.finish(self.filing.dismiss(request.number("id"), request.actor))

    def stop(self, request: Request) -> Response:
        return self.finish(self.filing.stop(request.number("id"), request.actor))

    def remove(self, request: Request) -> Response:
        return self.finish(self.filing.remove(request.number("id"), request.actor))

    def reopen(self, request: Request) -> Response:
        return self.finish(self.filing.reopen(request.number("id"), request.actor))

    def finish(self, dump: Dump) -> Response:
        return Response.json(self.shown(dump))
