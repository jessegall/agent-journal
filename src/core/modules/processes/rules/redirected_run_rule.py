from core.modules.processes.support.process_nudges import REDIRECTED_RUN
from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.command_category import CommandCategory
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.part import Part
from core.base.driver.rule_answer import RuleAnswer

READ_BY_READERS = (CommandCategory.TEST_RUN, CommandCategory.BUILD, CommandCategory.CHECK)
DEVICES = "/dev/"


class RedirectedRunRule(DriverRule):
    """Tells an agent that a test run, a build or a check it sends to a file reaches no reader, and how to run it instead."""

    name = "processes.redirected-run"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    roles = [AgentRole.MAIN, AgentRole.WORKER]

    def answer(self, hook: AgentHook) -> RuleAnswer:
        shell = hook.event.tool.shell if hook.event.tool is not None else None
        if shell is None or shell.parse_error:
            return RuleAnswer.allowed()
        programs = list(dict.fromkeys(part.program for part in shell.parts if self.is_redirected(part)))
        if not programs:
            return RuleAnswer.allowed()
        return RuleAnswer.with_nudges(REDIRECTED_RUN.nudge(programs=', '.join(programs)))

    def is_redirected(self, part: Part) -> bool:
        return part.classification.category in READ_BY_READERS and any(not path.startswith(DEVICES) for path in part.output_paths)
