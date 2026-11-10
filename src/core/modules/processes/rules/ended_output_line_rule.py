from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.hook_history import HookHistory
from engine.enums.hook_wildcard import HookWildcard
from engine.driver.rule_answer import RuleAnswer
from engine.query.conditions.greater import Greater
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.processes.support.ended_output_text import EndedOutputText


class EndedOutputLineRule(DriverRule):
    """Tells an agent once, on its next hook that takes lines, that a run it moved to the background has
    ended, and how to read such a run better."""

    name = "processes.ended-output-line"
    hook = HookWildcard.ALL_HOOKS
    drivers = ["*"]
    history = True

    def __init__(self, processes: ProcessQuery, text: EndedOutputText, hook_history: HookHistory) -> None:
        self.processes, self.text, self.hook_history = processes, text, hook_history

    def answer(self, hook: AgentHook) -> RuleAnswer:
        if not hook.event.accepts_lines:
            return RuleAnswer.allowed()
        answered_at = self.hook_history.last_answer(self.name, hook)
        ended = self.processes.agent(hook.agent_id).moved().ended()
        if answered_at is not None:
            ended = ended.matching(Greater("ended_at", answered_at.text))
        return RuleAnswer.with_nudges(*self.text.nudges(tuple(ended.oldest().all_rows())))
