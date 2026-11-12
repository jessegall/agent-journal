from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_event_name import HookEventName
from engine.driver.rule_answer import RuleAnswer
from engine.query.conditions.prefix import Prefix
from core.modules.drivers.support.suite_choice import SuiteChoice
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.processes.support.process_nudges import ALIAS_SUGGESTION

OFTEN_RUN_COUNT = 8
SHAPE_TERMS = 3
SKIPPED_TERMS = ("journal", "git", "ls", "cat", "grep", "sed", "for", "set", "cd", "python3")


class AliasSuggestionRule(DriverRule):
    """A command an agent keeps running, as a part of its runs opening on the same words as this one,
    teaches it to add an alias, for the roles the suite policy has use saved commands; only a shell
    line asks, and it only counts."""

    name = "processes.alias-suggestion"
    hook = HookEventName.POST_TOOL_USE
    drivers = ["*"]

    def __init__(self, processes: ProcessQuery, suites: SuiteChoice) -> None:
        self.processes, self.suites = processes, suites

    def answer(self, hook: AgentHook) -> RuleAnswer:
        shell = hook.event.tool.shell if hook.event.tool is not None else None
        if shell is None or hook.role not in self.suites.agent_policy().saved_command_roles:
            return RuleAnswer.allowed()
        commands = [part.text.split()[:SHAPE_TERMS] for part in shell.parts if part.text.split()[0] not in SKIPPED_TERMS and not part.saved_command]
        if not commands:
            return RuleAnswer.allowed()
        shape = " ".join(commands[0])
        count = self.processes.agent(hook.agent_id).with_part(Prefix("text", shape)).count()
        return RuleAnswer.with_nudges(ALIAS_SUGGESTION.nudge(shape=shape, count=count)) if count >= OFTEN_RUN_COUNT else RuleAnswer.allowed()
