from core.modules.processes.support.process_nudges import OUTPUT_PROGRESS, OUTPUT_RUNNING
from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_event_name import HookEventName
from engine.driver.rule_answer import RuleAnswer
from core.modules.processes.commands.record_given_percent.record_given_percent import RecordGivenPercent
from core.modules.processes.models.watch import UNANNOUNCED_PERCENT, Watch
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.processes.queries.watch_query import WatchQuery

PROGRESS_STEP_PERCENT = 10


class WatchLinesRule(DriverRule):
    """After every tool use, an agent watching a run is told once that it runs, then its progress only as it
    passes each 10 percent; the run's end has its own line, and its output is read on request, as version 4
    did."""

    name = "processes.watch-lines"
    hook = HookEventName.POST_TOOL_USE
    drivers = ["*"]

    def __init__(self, watches: WatchQuery, processes: ProcessQuery) -> None:
        self.watches, self.processes = watches, processes

    def answer(self, hook: AgentHook) -> RuleAnswer:
        answer = RuleAnswer.allowed()
        for watch in tuple(self.watches.progress_due(hook.agent_id, PROGRESS_STEP_PERCENT).oldest().all_rows()):
            answer = self.with_progress(answer, watch)
        return answer

    def with_progress(self, answer: RuleAnswer, watch: Watch) -> RuleAnswer:
        if watch.given_percent == UNANNOUNCED_PERCENT:
            return RuleAnswer(refusal=answer.refusal, nudges=[*answer.nudges, OUTPUT_RUNNING.nudge(output=watch.process_id)], commands=[*answer.commands, RecordGivenPercent(watch.id, 0)])
        progress = self.processes.find(watch.process_id).progress
        step = progress - progress % PROGRESS_STEP_PERCENT
        if step <= watch.given_percent:
            return answer
        return RuleAnswer(refusal=answer.refusal, nudges=[*answer.nudges, OUTPUT_PROGRESS.nudge(output=watch.process_id, percent=progress)], commands=[*answer.commands, RecordGivenPercent(watch.id, step)])
