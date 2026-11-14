from collections import defaultdict

from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_event_name import HookEventName
from engine.driver.rule_answer import RuleAnswer
from core.modules.processes.queries.output_query import OutputQuery
from core.modules.processes.support.process_nudges import SHARED_TITLE


class RunTitleRule(DriverRule):
    """Two running outputs of one agent, of any role, with one title teach the title in words."""

    name = "processes.run-titles"
    hook = HookEventName.POST_TOOL_USE
    drivers = ["*"]

    def __init__(self, outputs: OutputQuery) -> None:
        self.outputs = outputs

    def answer(self, hook: AgentHook) -> RuleAnswer:
        titled = self.outputs.running_titles(hook.agent_id).get()
        identical: defaultdict[str, list[str]] = defaultdict(list)
        for output in titled:
            identical[output.title].append(str(output.process_id))
        shared = [SHARED_TITLE.nudge(outputs=", ".join(numbers)) for numbers in identical.values() if len(numbers) > 1]
        return RuleAnswer.with_nudges(*shared)
