from engine.driver.nudge import Nudge
from engine.driver.hook_event import HookEvent
from engine.agent_machine.contracts.event_policy import EventPolicy
from suites.coding.modules.workers.types.worker import Worker
from engine.enums.command_category import CommandCategory
from suites.coding.modules.workers.bindings.worker_test_listings import WorkerTestListings
from suites.coding.modules.workers.nudges.worker_test_limit_refusal_nudge import WorkerTestLimitRefusalNudge
from engine.setting.setting_values import SettingValues
from suites.coding.support.coding_settings import WORKER_TEST_LIMIT
from core.modules.processes.support.reader_demands import ASKING_FLAGS


class WorkerTestCountPolicy(EventPolicy):
    """Refuses a worker's command when its latest counted output exceeds the test limit."""

    key = "processes.worker-test-limit-refusal"
    rank = "shell.all"
    agent_types = [Worker.key]


    def __init__(self, listings: WorkerTestListings, settings: SettingValues) -> None:
        self.listings, self.settings = listings, settings

    def refusal(self, event: HookEvent, agent_id: int) -> Nudge | None:
        limit = self.settings.number(WORKER_TEST_LIMIT)
        tool = event.tool
        if limit <= 0 or tool is None or tool.shell is None:
            return None
        test_lines = dict.fromkeys(part.text for part in tool.shell.parts
                                   if part.classification.category is CommandCategory.TEST_RUN and not ASKING_FLAGS.intersection(part.arguments))
        for line in test_lines:
            count = self.listings.previous_count(line)
            if count > limit:
                return WorkerTestLimitRefusalNudge.declared().nudge(count=count, limit=limit)
        return None
