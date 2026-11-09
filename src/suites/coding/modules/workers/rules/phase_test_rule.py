from dataclasses import replace

from core.modules.settings.bindings.support.setting_values import SettingValues
from suites.coding.modules.workers.models.worker_test_run import WorkerTestRun
from suites.coding.modules.workers.commands.record_worker_test_run.record_worker_test_run import RecordWorkerTestRun
from suites.coding.modules.workers.support.worker_settings import WORKER_PHASE_TEST_RUNS

from core.base.driver.agent_hook import AgentHook
from core.base.driver.command_category import CommandCategory
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.part import Part
from core.base.driver.rule_answer import RuleAnswer
from core.base.driver.shell_line import ShellLine
from core.base.query.queries import Queries
from suites.coding.modules.workers.support.worker_test_group import WorkerTestGroup
from core.modules.processes.support.background_commands import BackgroundCommands
from core.modules.processes.support.reader_demands import ASKING_FLAGS
from suites.coding.modules.workers.support.worker_nudges import PHASE_TEST_REFUSED, PHASE_TEST_RUN_ALLOWED
from suites.coding.modules.workers.support.worker_phases import WorkerPhases
from suites.coding.modules.workers.support.worker_test_names import WorkerTestNames
from suites.coding.support.coding_helper_role import CodingHelperRole


class PhaseTestRule(DriverRule):
    """Allows counted tests within a phase and refuses them after the allowance is spent."""

    name = "workers.phase-tests"
    priority = -2
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    roles = [CodingHelperRole.WORKER]
    refuses_one_action = "Allows counted tests within a phase and handles requests after the allowance is spent"

    def __init__(self, phases: WorkerPhases, commands: BackgroundCommands, queries: Queries, settings: SettingValues) -> None:
        self.phases, self.commands, self.queries, self.settings = phases, commands, queries, settings

    def answer(self, hook: AgentHook) -> RuleAnswer:
        tool = hook.event.tool
        if tool is None or tool.shell is None:
            return RuleAnswer.allowed()
        test_part_count = sum(self.is_test_part(part, tool.shell) for part in tool.shell.parts)
        if not test_part_count:
            return RuleAnswer.allowed()
        group = self.phases.waiting_group(hook.agent_id)
        if group is None or self.phases.has_delivered(hook.agent_id):
            return RuleAnswer.allowed()
        used = self.queries.query(WorkerTestRun).filter(worker_id=hook.agent_id, group_key=group.key).count()
        remaining = self.settings.number(WORKER_PHASE_TEST_RUNS) - used
        return self.line_answer([self.part_answer(hook.agent_id, group, remaining - position) for position in range(test_part_count)])

    def is_test_part(self, part: Part, shell: ShellLine) -> bool:
        return (WorkerTestNames.is_worker_test(part) or self.commands.part_command(part, shell).category is CommandCategory.TEST_RUN) and not ASKING_FLAGS.intersection(part.arguments)

    @staticmethod
    def part_answer(worker_id: int, group: WorkerTestGroup, remaining: int) -> RuleAnswer:
        if remaining <= 0:
            return RuleAnswer.refused(PHASE_TEST_REFUSED.nudge())
        return RuleAnswer.with_nudges(PHASE_TEST_RUN_ALLOWED.nudge(remaining=remaining - 1)).running_unrefused(RecordWorkerTestRun(worker_id, group.key))

    @staticmethod
    def line_answer(answers: list[RuleAnswer]) -> RuleAnswer:
        refusals = [answer for answer in answers if answer.refusal]
        first_answer, *remaining_answers = refusals or [RuleAnswer.allowed(), *answers]
        combined = first_answer.running(*(command for answer in remaining_answers for command in answer.commands)).running_unrefused(*(command for answer in remaining_answers for command in answer.commands_unrefused))
        return combined if refusals else replace(combined, nudges=tuple(nudge for answer in answers for nudge in answer.nudges))
