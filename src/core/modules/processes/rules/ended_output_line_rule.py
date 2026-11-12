from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.hook_history import HookHistory
from engine.enums.hook_wildcard import HookWildcard
from engine.driver.rule_answer import RuleAnswer
from engine.query.conditions.greater import Greater
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.processes.support.process_nudges import OUTPUT_ENDED


class EndedOutputLineRule(DriverRule):
    """Tells an agent once, on its next hook that takes lines, that a run it moved to the background has
    ended; how to read such a run better is sent by ReadingNotices when the run ends."""

    name = "processes.ended-output-line"
    hook = HookWildcard.ALL_HOOKS
    drivers = ["*"]
    history = True

    def __init__(self, processes: ProcessQuery, hook_history: HookHistory) -> None:
        self.processes, self.hook_history = processes, hook_history

    def answer(self, hook: AgentHook) -> RuleAnswer:
        if not hook.event.accepts_lines:
            return RuleAnswer.allowed()
        answered_at = self.hook_history.last_answer(self.name, hook)
        ended = self.processes.agent(hook.agent_id).moved().ended()
        if answered_at is not None:
            ended = ended.matching(Greater("ended_at", answered_at.text))
        return RuleAnswer.with_nudges(*(OUTPUT_ENDED.nudge(output=process.id) for process in ended.oldest().all_rows()))
