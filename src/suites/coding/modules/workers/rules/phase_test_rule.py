from core.base.driver.agent_hook import AgentHook
from core.base.driver.command_category import CommandCategory
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.part import Part
from core.base.driver.rule_answer import RuleAnswer
from core.base.driver.shell_line import ShellLine
from core.modules.processes.support.background_commands import BackgroundCommands
from core.modules.processes.support.reader_demands import ASKING_FLAGS
from suites.coding.modules.workers.support.worker_nudges import PHASE_TEST_REFUSED
from suites.coding.modules.workers.support.worker_phases import WorkerPhases
from suites.coding.support.coding_agent_role import CodingAgentRole as AgentRole


class PhaseTestRule(DriverRule):
    """Refuses a worker's test run while its current task is in a phase of a started plan, whose tests run at the
    phase's end. It runs before the rules about saved commands and readers, so the worker hears this first."""

    name = "workers.phase-tests"
    priority = -2
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    roles = [AgentRole.WORKER]

    def __init__(self, phases: WorkerPhases, commands: BackgroundCommands) -> None:
        self.phases, self.commands = phases, commands

    def answer(self, hook: AgentHook) -> RuleAnswer:
        tool = hook.event.tool
        if tool is None or tool.shell is None or not any(self.is_test_part(part, tool.shell) for part in tool.shell.parts):
            return RuleAnswer.allowed()
        phase = self.phases.held_phase(hook.agent_id)
        if phase is None:
            return RuleAnswer.allowed()
        return RuleAnswer.refused(PHASE_TEST_REFUSED.nudge(phase=phase.id, plan=phase.plan_id))

    def is_test_part(self, part: Part, shell: ShellLine) -> bool:
        return self.commands.part_command(part, shell).category is CommandCategory.TEST_RUN and not ASKING_FLAGS.intersection(part.arguments)
