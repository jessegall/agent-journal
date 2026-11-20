from engine.driver.agent_message import AgentMessage
from engine.driver.hook_event import HookEvent
from engine.agent_machine.contracts.event_policy import EventPolicy
from suites.coding.modules.workers.types.worker import Worker
from engine.enums.command_category import CommandCategory
from suites.coding.modules.workers.bindings.worker_test_listings import WorkerTestListings
from suites.coding.modules.workers.agent_messages.worker_test_limit_refusal_message import WorkerTestLimitRefusalMessage
from engine.setting.setting_values import SettingValues
from suites.coding.support.coding_settings import WORKER_TEST_LIMIT
from suites.coding.modules.workers.support.worker_settings import WORKERS_RUN_ANY_COMMAND
from core.modules.processes.support.reader_demands import ASKING_FLAGS


class WorkerTestCountPolicy(EventPolicy):
    """Refuses a worker's command when its latest counted output exceeds the test limit."""

    key = "processes.worker-test-limit-refusal"
    rank = "workers.policies"
    agent_types = [Worker.key]


    def __init__(self, listings: WorkerTestListings, settings: SettingValues) -> None:
        self.listings, self.settings = listings, settings

    def refusal(self, event: HookEvent, agent_id: int) -> AgentMessage | None:
        limit = self.settings.number(WORKER_TEST_LIMIT)
        tool = event.tool
        if limit <= 0 or tool is None or tool.shell is None or self.settings.flag(WORKERS_RUN_ANY_COMMAND):
            return None
        test_lines = dict.fromkeys(part.text for part in tool.shell.parts
                                   if part.classification.category is CommandCategory.TEST_RUN and not ASKING_FLAGS.intersection(part.arguments))
        for line in test_lines:
            count = self.listings.previous_count(line)
            if count > limit:
                return WorkerTestLimitRefusalMessage.declared().agent_message(count=count, limit=limit)
        return None
