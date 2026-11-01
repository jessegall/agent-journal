from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.command_category import CommandCategory
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.base.query.conditions.among import Among
from core.base.query.queries import Queries
from core.modules.processes.models.enums.process_state import ProcessState
from core.modules.processes.models.process import Process
from suites.coding.modules.workers.support.worker_nudges import WORKER_TEST_TURN

OPEN_STATES = (ProcessState.RUNNING, ProcessState.BACKGROUND)


class WorkerTestTurnRule(DriverRule):
    """A worker runs its tests one at a time with every other agent of its environment, since two suites at
    once starve the machine: its run is refused while another goes, naming the run to wait for."""

    name = "workers.test-turn"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    roles = [AgentRole.WORKER]

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def answer(self, hook: AgentHook) -> RuleAnswer:
        shell = hook.event.tool.shell if hook.event.tool is not None else None
        if shell is None or not any(part.classification.category is CommandCategory.TEST_RUN for part in shell.parts):
            return RuleAnswer.allowed()
        runs = self.queries.query(Process).filter(environment_id=hook.environment_id, category=CommandCategory.TEST_RUN).matching(Among("state", OPEN_STATES)).all_rows()
        running = next((run for run in runs if run.agent_id != hook.agent_id), None)
        return RuleAnswer.allowed() if running is None else RuleAnswer.refused(WORKER_TEST_TURN.nudge(process=running.id, agent=running.agent_id))
