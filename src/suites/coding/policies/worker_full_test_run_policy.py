from engine.agent_machine.contracts.event_policy import EventPolicy
from engine.driver.hook_event import HookEvent
from engine.driver.nudge import Nudge
from suites.coding.drivers.worker.worker_agent_driver import WorkerAgentDriver
from suites.coding.nudges.worker_full_test_run_nudge import WorkerFullTestRunNudge

WORKER_FULL_TEST_RUN_KEY = "workers.no-full-test-run"


class WorkerFullTestRunPolicy(EventPolicy):
    """A worker runs only the tests of what it changed: a tool call with a run of the whole suite in its chain is
    refused whole, judged on the final action."""

    key = WORKER_FULL_TEST_RUN_KEY
    rank = "workers.policies"
    agent_types = [WorkerAgentDriver.agent_type]

    def refusal(self, event: HookEvent, agent_id: int) -> Nudge | None:
        shell = event.tool.shell if event.tool is not None else None
        return WorkerFullTestRunNudge.declared().nudge() if shell is not None and shell.has_full_test_run else None
