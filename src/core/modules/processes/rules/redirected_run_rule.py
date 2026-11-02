import re

from core.modules.processes.support.process_nudges import PIPED_RUN, REDIRECTED_RUN
from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.command_category import CommandCategory
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.part import Part
from core.base.driver.rule_answer import RuleAnswer
from core.base.driver.shell_line import ShellLine

READER_CATEGORIES = (CommandCategory.TEST_RUN, CommandCategory.BUILD, CommandCategory.CHECK)
STANDARD_OUTPUT_REDIRECT = re.compile(r"(?:1?>>?|&>>?)\s*[^&\s]")


class RedirectedRunRule(DriverRule):
    """Refuses a tool call that sends a test run, a build or a check to a file or to /dev/null, which no reader
    would see, and tells an agent that one it cuts with a pipe reaches its reader badly."""

    name = "processes.redirected-run"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    roles = [AgentRole.MAIN, AgentRole.WORKER]

    def answer(self, hook: AgentHook) -> RuleAnswer:
        shell = hook.event.tool.shell if hook.event.tool is not None else None
        if shell is None or shell.parse_error:
            return RuleAnswer.allowed()
        redirected = list(dict.fromkeys(part.program for part in shell.parts if self.is_redirected(part, shell)))
        if redirected:
            return RuleAnswer.refused(REDIRECTED_RUN.nudge(programs=', '.join(redirected)))
        piped = list(dict.fromkeys(part.program for part in shell.parts if self.is_piped(part)))
        return RuleAnswer.with_nudges(PIPED_RUN.nudge(programs=', '.join(piped))) if piped else RuleAnswer.allowed()

    def is_piped(self, part: Part) -> bool:
        return part.classification.category in READER_CATEGORIES and part.pipe_target is not None

    def is_redirected(self, part: Part, shell: ShellLine) -> bool:
        return part.classification.category in READER_CATEGORIES and any(redirect in part.text and STANDARD_OUTPUT_REDIRECT.match(redirect) for redirect in shell.redirects)
