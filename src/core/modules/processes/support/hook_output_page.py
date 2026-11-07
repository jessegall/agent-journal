from dataclasses import dataclass

from core.base.subcommand.output import Output
from core.modules.processes.support.output_page import OutputPage


@dataclass(frozen=True)
class HookOutputPage(OutputPage):
    command: str = ""

    def write(self, output: Output) -> None:
        output.write("\n".join(self.lines), {"lines": list(self.lines), "first_byte": self.first_byte, "last_byte": self.last_byte, "total": self.total, "cut_bytes": self.cut_bytes, "command": self.command})
