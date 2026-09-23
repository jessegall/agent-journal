from pathlib import Path

import controllers.types as types_module
from controllers.types import Agents
import resources.types as resources_module
from controllers.base import Controller
from resources.base import Refused
from features.journal_laws.resource import Output
from providers import PROVIDERS

TITLE_LENGTH = 80


class Outputs(Controller):
    resource = Output

    def keep(self, path: str, command_line: str = "", provider: str = "", session_id: str = "", shown: int = 0) -> str:
        source = Path(path)
        if not source.is_file():
            raise Refused(f"no such file: {path}")
        if provider and provider not in PROVIDERS:
            raise Refused(f"no such provider: {provider}")
        command_line = PROVIDERS[provider]().unwrapped_command(command_line) if provider else command_line
        with source.open("rb") as text:
            lines = sum(1 for _ in text)
        title = " ".join(command_line.split()).replace(":", " ")[:TITLE_LENGTH] or "command output"
        made = self.create(title, command=command_line, lines=lines)
        self.attach(made.n, path, f"{lines} lines")
        source.unlink()
        agent = Agents(self.record, actor=self.actor)._titled(session_id) if session_id else None
        if agent:
            Agents(self.record, actor=self.actor).card(agent.n, label=f"Cut {lines - shown:,} of {lines:,} lines from a long output, kept whole as output {made.n}",
                                                       icon="terminal", command=command_line)
        return f"{made.n} {(self.folder(made.n) / source.name).resolve()}"


resources_module.register(Output)
types_module.register(Outputs)
