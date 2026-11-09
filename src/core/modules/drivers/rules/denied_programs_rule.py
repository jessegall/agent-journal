from collections.abc import Sequence
from typing import ClassVar

from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.rule_answer import RuleAnswer
from core.modules.drivers.support.access_nudges import PROGRAM_RESTRICTION


class DeniedProgramsRule(DriverRule):
    """Refuses a shell line containing any program a driver excludes."""

    name = "drivers.denied-programs"
    hook = HookEventName.PRE_TOOL_USE
    exempt = True
    denied_programs: ClassVar[Sequence[str]] = ()
    refusal: ClassVar[NudgeDeclaration] = PROGRAM_RESTRICTION
    refuses_one_action = "Refuses a shell line containing any program a driver excludes"

    def answer(self, hook: AgentHook) -> RuleAnswer:
        shell = hook.event.tool.shell if hook.event.tool is not None else None
        refused = shell.denied_program_part(self.denied_programs) if shell is not None else None
        if refused is None:
            return RuleAnswer.allowed()
        return RuleAnswer.refused(self.refusal.nudge(program=refused.program))
