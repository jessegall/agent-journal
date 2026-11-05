from dataclasses import dataclass

from core.base.command.command import Command
from core.base.sandbox_level import SandboxLevel
from core.modules.processes.models.process import Process


@dataclass(frozen=True)
class RecordSandbox(Command[Process]):
    process_id: int
    level: SandboxLevel
