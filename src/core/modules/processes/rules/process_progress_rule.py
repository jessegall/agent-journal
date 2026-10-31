from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_wildcard import HookWildcard
from core.base.driver.rule_answer import RuleAnswer
from core.modules.processes.commands.note_progress import NoteProgress
from core.modules.processes.models.process import Process
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.processes.queries.reader_query import ReaderQuery
from core.modules.processes.support.output_folder import OutputFolder
from core.modules.processes.support.reader_run import ReaderRun
from core.modules.processes.support.reader_selection import ReaderSelection


class ProcessProgressRule(DriverRule):
    """On each hook of an agent, notes how far its running outputs have come, as the reader of each reads the
    progress."""

    name = "processes.process-progress"
    hook = HookWildcard.ALL_HOOKS
    drivers = ["*"]
    roles = [AgentRole.MAIN, AgentRole.WORKER]

    def __init__(self, processes: ProcessQuery, readers: ReaderQuery, folder: OutputFolder, run: ReaderRun) -> None:
        self.processes, self.readers, self.folder, self.run = processes, readers, folder, run

    def answer(self, hook: AgentHook) -> RuleAnswer:
        progress_commands = [NoteProgress(process.id, percent) for process in self.processes.agent(hook.agent_id).running().oldest().all_rows() if (percent := self.percent(process)) != process.progress]
        return RuleAnswer.allowed().running(*progress_commands)

    def percent(self, process: Process) -> int:
        reader = ReaderSelection.choose(tuple(self.readers.all_rows()), process)
        if reader is None:
            return process.progress
        text = self.folder.all_output(process.id)
        return self.run.progress(reader, text, process.progress)
