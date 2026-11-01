from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.modules.processes.commands.record_given_percent.record_given_percent import RecordGivenPercent
from core.modules.processes.models.watch import Watch
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.processes.queries.watch_query import WatchQuery

PROGRESS_STEP_PERCENT = 10


class WatchLinesRule(DriverRule):
    """After every tool use, an agent watching a run is told its progress, only as it passes each 10 percent; the run's
    end has its own line, and its output is read on request, as version 4 did."""

    name = "processes.watch-lines"
    hook = HookEventName.POST_TOOL_USE
    drivers = ["*"]
    roles = [AgentRole.MAIN, AgentRole.WORKER]

    def __init__(self, watches: WatchQuery, processes: ProcessQuery) -> None:
        self.watches, self.processes = watches, processes

    def answer(self, hook: AgentHook) -> RuleAnswer:
        answer = RuleAnswer.allowed()
        for watch in tuple(self.watches.open(hook.agent_id).oldest().all_rows()):
            answer = self.told(answer, watch)
        return answer

    def told(self, answer: RuleAnswer, watch: Watch) -> RuleAnswer:
        progress = self.processes.find(watch.process_id).progress
        step = progress - progress % PROGRESS_STEP_PERCENT
        if step <= watch.given_percent:
            return answer
        line = f"output {watch.process_id}: {progress}%"
        return RuleAnswer(refusal=answer.refusal, lines=[*answer.lines, line], commands=[*answer.commands, RecordGivenPercent(watch.id, step)])
