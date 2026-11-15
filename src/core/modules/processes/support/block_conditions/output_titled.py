from core.modules.processes.support.run_output_rows import RunOutputRows
from engine.driver.block_check import BlockCheck
from core.modules.processes.support.block_conditions.process_condition import ProcessCondition
from core.modules.processes.models.enums.process_state import ProcessState
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.processes.support.run_title import RunTitle


class OutputTitled(ProcessCondition):
    """A title can no longer be asked of this run: the agent runs the command that titles it, its output has a
    descriptive title, the run ended, or it kept no output."""

    name = "output-titled"

    def is_true(self, check: BlockCheck) -> bool:
        tool = check.hook.event.tool
        if tool is not None and tool.shell is not None and tool.shell.has_part_running(f"journal output title {self.text}"):
            return True
        process = check.container.get(ProcessQuery).find(int(self.text))
        output = check.container.get(RunOutputRows).of_run(process.id)
        return output is None or process.state not in (ProcessState.RUNNING, ProcessState.BACKGROUND) or RunTitle.is_descriptive(output.title, process.line)
