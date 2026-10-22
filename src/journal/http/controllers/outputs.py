from pathlib import Path

from journal.features.shell.support.output_files import OutputFiles
from journal.features.shell.support.output_views import OutputViews
from journal.http.support.model_fields import ModelFields
from journal.http.support.request import Request
from journal.support.response import Response
from journal.repositories.command_outputs import CommandOutputs


class OutputController:
    """What one kept output holds, for the viewer's dialog: its command, how it ended and what it printed; and the live view of several at once, the fields their cards show, which the chat asks for every second while any of them runs."""

    def __init__(self, outputs: CommandOutputs, views: OutputViews) -> None:
        self.outputs, self.views = outputs, views

    def show(self, request: Request) -> Response:
        output = self.outputs.find(request.number("id"))
        files = OutputFiles(Path(output.folder))
        stored = files.is_stored()
        return Response.json({**ModelFields.build(output), "outcome": files.outcome() if stored else "files gone", "lines": files.lines() if stored else []})

    def progress(self, request: Request) -> Response:
        numbers = [int(n) for n in request.query.get("ids", "").split(",") if n.strip().isdigit()]
        return Response.json({str(n): self.views.progress_view(self.outputs.find(n)) for n in numbers})
