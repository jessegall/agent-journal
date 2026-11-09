import re

from core.modules.processes.support.process_nudges import REDIRECTED_RUN
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.part import Part
from core.base.driver.rule_answer import RuleAnswer
from core.base.driver.shell_line import ShellLine

STANDARD_OUTPUT_REDIRECT = re.compile(r"(?:1?>>?|&>>?)\s*[^&\s]")


class RedirectedRunRule(DriverRule):
    """Refuses a tool call that sends a test run, a build or a check to a file or to /dev/null, which no reader
    would see."""

    name = "processes.redirected-run"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    refuses_one_action = "Refuses a tool call that sends a test run, a build or a check to a file or to /dev/null, which no reader"

    def answer(self, hook: AgentHook) -> RuleAnswer:
        shell = hook.event.tool.shell if hook.event.tool is not None else None
        if shell is None or shell.parse_error:
            return RuleAnswer.allowed()
        redirected = list(dict.fromkeys(part.program for part in shell.parts if self.is_redirected(part, shell)))
        return RuleAnswer.refused(REDIRECTED_RUN.nudge(programs=', '.join(redirected))) if redirected else RuleAnswer.allowed()

    def is_redirected(self, part: Part, shell: ShellLine) -> bool:
        return part.classification.category.is_watched and any(redirect in part.text and STANDARD_OUTPUT_REDIRECT.match(redirect) for redirect in shell.redirects)
