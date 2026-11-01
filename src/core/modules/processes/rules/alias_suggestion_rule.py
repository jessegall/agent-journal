from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.base.query.conditions.starts_with import StartsWith
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.processes.support.process_nudges import ALIAS_SUGGESTION

OFTEN_RUN_COUNT = 8
SHAPE_WORDS = 3
SKIPPED_WORDS = ("journal", "git", "ls", "cat", "grep", "sed", "for", "set", "cd", "python3")


class AliasSuggestionRule(DriverRule):
    """A command line the main agent keeps running, its runs opening on the same words as this one, teaches it to add an alias; only a shell line asks, and it only counts."""

    name = "processes.alias-suggestion"
    hook = HookEventName.POST_TOOL_USE
    drivers = ["*"]
    roles = [AgentRole.MAIN]

    def __init__(self, processes: ProcessQuery) -> None:
        self.processes = processes

    def answer(self, hook: AgentHook) -> RuleAnswer:
        shell = hook.event.tool.shell if hook.event.tool is not None else None
        words = shell.line.split()[:SHAPE_WORDS] if shell is not None else []
        if not words or words[0] in SKIPPED_WORDS:
            return RuleAnswer.allowed()
        shape = " ".join(words)
        count = self.processes.agent(hook.agent_id).matching(StartsWith("line", shape)).count()
        return RuleAnswer.with_nudges(ALIAS_SUGGESTION.nudge(shape=shape, count=count)) if count >= OFTEN_RUN_COUNT else RuleAnswer.allowed()
