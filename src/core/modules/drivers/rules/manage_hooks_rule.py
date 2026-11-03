from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.base.journal_home import JournalHome
from core.modules.agents.commands.manage_program.manage_program import ManageProgram


class ManageHooksRule(DriverRule):
    """Imports project hooks added since the program was launched."""

    name = "drivers.manage-hooks"
    hook = HookEventName.SESSION_START
    drivers = ["*"]
    essential = True

    def __init__(self, home: JournalHome) -> None:
        self.home = home

    def answer(self, hook: AgentHook) -> RuleAnswer:
        folder = str(hook.event.raw.get("cwd", self.home.project_folder))
        return RuleAnswer.allowed().running(ManageProgram(hook.event.program, folder))
