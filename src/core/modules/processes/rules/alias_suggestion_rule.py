from collections import Counter

from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.processes.support.process_nudges import ALIAS_SUGGESTION

RECENT_RUN_COUNT = 50
OFTEN_RUN_COUNT = 8
SHAPE_WORDS = 3
SKIPPED_WORDS = ("journal", "git", "ls", "cat", "grep", "sed", "for", "set", "cd", "python3")


class AliasSuggestionRule(DriverRule):
    """A command line the main agent keeps running, the first words of its recent runs the same, teaches it to add an alias."""

    name = "processes.alias-suggestion"
    hook = HookEventName.POST_TOOL_USE
    drivers = ["*"]
    roles = [AgentRole.MAIN]

    def __init__(self, processes: ProcessQuery) -> None:
        self.processes = processes

    def answer(self, hook: AgentHook) -> RuleAnswer:
        recent = self.processes.agent(hook.agent_id).newest().page(1, RECENT_RUN_COUNT).rows
        shapes = Counter(" ".join(process.line.split()[:SHAPE_WORDS]) for process in recent if process.line.split()[:1] and process.line.split()[0] not in SKIPPED_WORDS)
        common = shapes.most_common(1)
        if not common or common[0][1] < OFTEN_RUN_COUNT:
            return RuleAnswer.allowed()
        return RuleAnswer.with_nudges(ALIAS_SUGGESTION.nudge(shape=common[0][0], count=common[0][1]))
