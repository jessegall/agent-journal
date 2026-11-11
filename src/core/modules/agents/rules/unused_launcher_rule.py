from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.rule_answer import RuleAnswer
from engine.enums.agent_role import AgentRole
from engine.enums.hook_event_name import HookEventName
from core.modules.agents.commands.stop_unused_launcher.stop_unused_launcher import StopUnusedLauncher
from core.modules.agents.support.launcher_processes import LauncherProcesses


class UnusedLauncherRule(DriverRule):
    """On a main agent's tick, has each second launcher of this journal that serves nobody told to the person
    and stopped."""

    name = "agents.unused-launcher"
    hook = HookEventName.TICK
    drivers = ["*"]
    roles = [AgentRole.MAIN]

    def __init__(self, processes: LauncherProcesses) -> None:
        self.processes = processes

    def answer(self, hook: AgentHook) -> RuleAnswer:
        return RuleAnswer.allowed().running(*(StopUnusedLauncher(serving.pid, unused.pid) for serving, unused in self.processes.unused()))
