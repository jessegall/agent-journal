from dataclasses import dataclass

from engine.command.command import Command
from engine.enums.sandbox_level import SandboxLevel
from core.modules.processes.models.process import Process


@dataclass(frozen=True)
class RecordSandbox(Command[Process]):
    process_id: int
    level: SandboxLevel
