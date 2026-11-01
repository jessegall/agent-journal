from collections.abc import Mapping
from dataclasses import dataclass

from core.modules.processes.models.output import Output
from core.modules.processes.models.process import Process


@dataclass(frozen=True)
class ProcessCard:
    """What a run's docked card draws: the run, and what its output keeps of its title, steps and summary."""

    process: Process
    output: Output | None

    def json(self) -> Mapping[str, object]:
        process, output = self.process, self.output
        return {"id": process.id, "line": process.line, "state": process.state.value, "progress": process.progress, "created_at": process.created_at.text if process.created_at else None,
                "ended_at": process.ended_at.text if process.ended_at else None, "title": output.title if output else "", "steps_passed": output.steps_passed if output else 0,
                "steps_failed": output.steps_failed if output else 0, "summary": output.reader_summary if output else ""}
