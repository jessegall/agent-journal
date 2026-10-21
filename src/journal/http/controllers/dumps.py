from journal.features.dumps.support.dump_filer import DumpFiler
from journal.http.attachments.attachments import Attachments
from journal.http.controllers.controller import Controller
from journal.http.support.model_fields import ModelFields
from journal.http.support.request import Request
from journal.support.response import Response
from journal.models.dump import Dump
from journal.repositories.dumps import Dumps

class DumpController(Controller[Dump]):
    """What the viewer does to a dump: drop one, add files to it, answer its question, pick or decline its next steps, name it, stop, split or remove it; each with the rows it was filed into."""

    def __init__(self, filing: DumpFiler, dumps: Dumps, attachments: Attachments) -> None:
        self.filing, self.repository, self.attachments = filing, dumps, attachments

    def rows(self) -> list[Dump]:
        return self.repository.in_()

    def is_open(self, row: Dump) -> bool:
        return not row.is_completed

    def shown_page(self, rows: list[Dump]) -> list[dict]:
        filed = self.repository.every_linked()
        return [{**ModelFields.of(d), "filed": list(dict.fromkeys(str(ref) for ref in filed.get(d.id, [])))} for d in rows]

    def store(self, request: Request) -> Response:
        return Response.json(self.shown(self.filing.create(str(request.body.get("brief", "")), request.actor)), 201)

    def attach(self, request: Request) -> Response:
        dump = self.repository.find(request.number("id"))
        for name, data in request.files.items():
            self.filing.attach(dump.id, self.attachments.store(Dump.table(), dump.id, name, data), request.actor)
        return Response.json(self.shown(self.repository.find(dump.id)))

    def choose(self, request: Request) -> Response:
        return self.done(self.filing.choose(request.number("id"), int(request.body.get("pick", -1)), request.actor))

    def decline(self, request: Request) -> Response:
        return self.done(self.filing.decline(request.number("id"), int(request.body.get("pick", -1)), request.actor))

    def direct(self, request: Request) -> Response:
        return self.done(self.filing.direct(request.number("id"), str(request.body.get("how", "")), request.actor))

    def answer(self, request: Request) -> Response:
        return self.done(self.filing.answer(request.number("id"), str(request.body.get("text", "")), request.actor))

    def name(self, request: Request) -> Response:
        return self.done(self.filing.name(request.number("id"), str(request.body.get("title", "")), request.actor))

    def split(self, request: Request) -> Response:
        return self.done(self.filing.split(request.number("id"), str(request.body.get("parts", "")), request.actor))

    def dismiss(self, request: Request) -> Response:
        return self.done(self.filing.dismiss(request.number("id"), request.actor))

    def stop(self, request: Request) -> Response:
        return self.done(self.filing.stop(request.number("id"), request.actor))

    def remove(self, request: Request) -> Response:
        return self.done(self.filing.remove(request.number("id"), request.actor))

    def reopen(self, request: Request) -> Response:
        return self.done(self.filing.reopen(request.number("id"), request.actor))

    def done(self, dump: Dump) -> Response:
        return Response.json(self.shown(dump))
