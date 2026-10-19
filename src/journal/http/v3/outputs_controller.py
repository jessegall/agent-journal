from pathlib import Path

from journal.features.shell.output_files import OutputFiles
from journal.http.request import Request
from journal.http.response import Response
from journal.repositories.command_outputs import CommandOutputs


class OutputsController:
    """What one kept output holds, for the viewer's dialog: its command, how it ended and what it printed."""

    def __init__(self, outputs: CommandOutputs) -> None:
        self.outputs = outputs

    def read(self, request: Request) -> Response:
        output = self.outputs.find(request.number("n"))
        files = OutputFiles(Path(output.folder))
        kept = files.is_kept()
        return Response.json({"n": output.id, "command": output.command, "outcome": files.outcome() if kept else "files gone", "lines": files.lines() if kept else []})
