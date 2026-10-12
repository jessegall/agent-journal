from pathlib import Path

import controllers.types as types_module
from controllers.types import Agents
from controllers.base import Controller
from resources.base import Refused
from resources.journal_laws import Output
from providers import PROVIDERS
from controllers.marks import action

TITLE_LENGTH = 80


class Outputs(Controller):
    resource = Output

    @action
    def keep(self, path: str, command_line: str = "", provider: str | None = None, session_id: str | None = None, shown: int = 0) -> str:
        source = Path(path)
        if not source.is_file():
            raise Refused(f"no such file: {path}")
        if provider is not None and provider not in PROVIDERS:
            raise Refused(f"no such provider: {provider}")
        command_line = PROVIDERS[provider]().unwrapped_command(command_line) if provider is not None else command_line
        with source.open("rb") as text:
            lines = sum(1 for _ in text)
        title = " ".join(command_line.split()).replace(":", " ")[:TITLE_LENGTH] or "command output"
        made = self.create(title, command=command_line, lines=lines)
        self.attach(made.n, path, f"{lines} lines")
        source.unlink()
        agent = Agents(self.record, actor=self.actor).rows.by_title(session_id) if session_id is not None else None
        if agent:
            Agents(self.record, actor=self.actor).card(agent.n, label=f"Cut {lines - shown:,} of {lines:,} lines from a long output, kept whole as output {made.n}",
                                                       icon="terminal", command=command_line)
        return f"{made.n} {(self.folder(made.n) / source.name).resolve()}"


types_module.register(Outputs)
