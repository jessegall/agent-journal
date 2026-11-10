from core.modules.processes.support.process_card_json_record import ProcessCardJsonRecord
from engine.enums.command_category import CommandCategory
from dataclasses import dataclass

from core.modules.processes.models.output import Output
from core.modules.processes.models.process import Process
from core.modules.processes.models.reader import Reader
from core.modules.processes.support.run_title import RunTitle


@dataclass(frozen=True)
class ProcessCard:
    """What a run's docked card draws: the run, and what its output keeps of its title, steps and summary."""

    process: Process
    output: Output | None
    temporary_title: str
    reader: Reader | None
    category: CommandCategory
    reader_requested: bool = False

    @property
    def title(self) -> str:
        if self.category is CommandCategory.TEST_RUN:
            return RunTitle.tests(self.process, self.output, self.reader)
        return self.output.title if self.output and RunTitle.is_descriptive(self.output.title, self.process.line) else self.temporary_title

    def json(self) -> ProcessCardJsonRecord:
        process, output = self.process, self.output
        return {"id": process.id, "line": process.line, "state": process.state.value, "progress": process.progress, "created_at": process.created_at.text if process.created_at else None,
                "ended_at": process.ended_at.text if process.ended_at else None, "title": self.title, "steps_passed": output.steps_passed if output else 0,
                "steps_failed": output.steps_failed if output else 0, "summary": output.reader_summary if output else "",
                "agent_id": process.session_agent_id, "reads_progress": bool(self.reader and (self.reader.progress_pattern or self.reader.step_pattern)), "reader_requested": self.reader_requested}
