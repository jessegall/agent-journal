from pathlib import Path

import controllers.types as types_module
import resources.types as resources_module
from controllers.base import Controller
from resources.base import Refused
from features.journal_laws.resource import Output

TITLE_LENGTH = 80


class Outputs(Controller):
    resource = Output

    def keep(self, path: str, command_line: str = "") -> str:
        source = Path(path)
        if not source.is_file():
            raise Refused(f"no such file: {path}")
        with source.open("rb") as text:
            lines = sum(1 for _ in text)
        title = " ".join(command_line.split()).replace(":", " ")[:TITLE_LENGTH] or "command output"
        made = self.create(title, command=command_line, lines=lines)
        self.attach(made.n, path, f"{lines} lines")
        source.unlink()
        return f"{made.n} {(self.folder(made.n) / source.name).resolve()}"


resources_module.register(Output)
types_module.register(Outputs)
