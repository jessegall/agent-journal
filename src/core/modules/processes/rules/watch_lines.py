from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.base.query.queries import Queries
from core.modules.processes.commands.record_given_lines import RecordGivenLines
from core.modules.processes.models.process import Process
from core.modules.processes.models.watch import Watch
from core.modules.processes.queries.reader_query import ReaderQuery
from core.modules.processes.queries.watch_query import WatchQuery
from core.modules.processes.support.output_folder import OutputFolder
from core.modules.processes.support.reader_run import ReaderRun
from core.modules.processes.support.reader_selection import ReaderSelection


class WatchLines(DriverRule):
    """After every tool use, gives an agent the reader's lines of the new output of each run it watches."""

    name = "processes.watch-lines"
    hook = HookEventName.POST_TOOL_USE
    drivers = ["*"]
    roles = [AgentRole.MAIN, AgentRole.WORKER]

    def __init__(self, watches: WatchQuery, queries: Queries, folder: OutputFolder, readers: ReaderQuery, run: ReaderRun) -> None:
        self.watches, self.queries, self.folder, self.readers, self.run = watches, queries, folder, readers, run

    def answer(self, hook: AgentHook) -> RuleAnswer:
        answer = RuleAnswer.allowed()
        for watch in tuple(self.watches.open(hook.agent_id).oldest().all_rows()):
            answer = self.watched(answer, watch)
        return answer

    def watched(self, answer: RuleAnswer, watch: Watch) -> RuleAnswer:
        process = self.queries.query(Process).find(watch.process_id)
        all_lines = self.folder.all_output(process.id).splitlines()
        reader = ReaderSelection.choose(tuple(self.readers.all_rows()), process)
        if len(all_lines) <= watch.given_lines:
            return answer
        new_text = "\n".join(all_lines[watch.given_lines:]) + "\n"
        reader_lines = self.run.lines(reader, new_text, process.state.value, watch.given_lines + 1) if reader is not None else []
        given = [f"output {process.id}: {line}" for line in reader_lines]
        return RuleAnswer(refusal=answer.refusal, lines=[*answer.lines, *given], commands=[*answer.commands, RecordGivenLines(watch.id, len(all_lines))])
