from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.base.query.queries import Queries
from core.modules.processes.commands.mark_watch_seen import MarkWatchSeen
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
        text = "".join(self.folder.output(process.id, position) for position in range(1, len(self.folder.part_texts(process.id)) + 1))
        seen = text.splitlines()
        reader = ReaderSelection.of(tuple(self.readers.all_rows()), process)
        if len(seen) <= watch.seen_lines:
            return answer
        fresh = "\n".join(seen[watch.seen_lines:]) + "\n"
        lines = self.run.lines(reader, fresh, process.state.value, watch.seen_lines + 1) if reader is not None else []
        told = RuleAnswer.with_lines(*(f"output {process.id}: {line}" for line in lines))
        return RuleAnswer(refusal=answer.refusal, lines=[*answer.lines, *told.lines], commands=[*answer.commands, MarkWatchSeen(watch.id, len(seen))])
