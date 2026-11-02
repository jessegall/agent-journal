from collections import defaultdict

from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.base.query.conditions.among import Among
from core.base.query.queries import Queries
from core.modules.processes.models.output import Output
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.processes.support.process_nudges import SHARED_TITLE


class RunTitleRule(DriverRule):
    """Two running outputs with one title teach the title in words."""

    name = "processes.run-titles"
    hook = HookEventName.POST_TOOL_USE
    drivers = ["*"]
    roles = [AgentRole.MAIN]

    def __init__(self, processes: ProcessQuery, queries: Queries) -> None:
        self.processes, self.queries = processes, queries

    def answer(self, hook: AgentHook) -> RuleAnswer:
        running = tuple(process.id for process in self.processes.agent(hook.agent_id).running().all_rows())
        titled = [output for output in self.queries.query(Output).matching(Among("process_id", running)).all_rows() if output.title] if running else []
        identical: defaultdict[str, list[str]] = defaultdict(list)
        for output in titled:
            identical[output.title].append(str(output.process_id))
        shared = [SHARED_TITLE.nudge(outputs=", ".join(numbers)) for numbers in identical.values() if len(numbers) > 1]
        return RuleAnswer.with_nudges(*shared)
