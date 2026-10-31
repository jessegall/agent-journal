from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.modules.processes.commands.record_given_lines import RecordGivenLines
from core.modules.processes.models.watch import Watch
from core.modules.processes.queries.watch_query import WatchQuery
from core.modules.processes.support.output_folder import OutputFolder


class WatchLines(DriverRule):
    """After every tool use, gives an agent the lines its readers have kept of each run it watches, the ones it has not
    been given; it reads the lines file and runs no reader."""

    name = "processes.watch-lines"
    hook = HookEventName.POST_TOOL_USE
    drivers = ["*"]
    roles = [AgentRole.MAIN, AgentRole.WORKER]

    def __init__(self, watches: WatchQuery, folder: OutputFolder) -> None:
        self.watches, self.folder = watches, folder

    def answer(self, hook: AgentHook) -> RuleAnswer:
        answer = RuleAnswer.allowed()
        for watch in tuple(self.watches.open(hook.agent_id).oldest().all_rows()):
            answer = self.given(answer, watch)
        return answer

    def given(self, answer: RuleAnswer, watch: Watch) -> RuleAnswer:
        kept = self.folder.reader_lines(watch.process_id)
        if len(kept) <= watch.given_lines:
            return answer
        new_lines = [f"output {watch.process_id}: {line}" for line in kept[watch.given_lines:]]
        return RuleAnswer(refusal=answer.refusal, lines=[*answer.lines, *new_lines], commands=[*answer.commands, RecordGivenLines(watch.id, len(kept))])
