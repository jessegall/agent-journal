from engine.driver.hook_event import HookEvent
from engine.agent_machine.contracts.event_policy import EventPolicy
from suites.coding.modules.workers.types.worker import Worker
from engine.enums.command_category import CommandCategory
from engine.driver.agent_message import AgentMessage
from core.modules.processes.support.background_commands import BackgroundCommands
from core.modules.processes.support.reader_demands import ASKING_FLAGS
from suites.coding.modules.workers.agent_messages.worker_test_commands_missing_message import WorkerTestCommandsMissingMessage
from suites.coding.modules.workers.agent_messages.worker_test_line_refusal_message import WorkerTestLineRefusalMessage
from suites.coding.modules.workers.support.worker_test_names import WorkerTestNames
from engine.setting.setting_values import SettingValues
from suites.coding.modules.workers.support.worker_settings import WORKERS_RUN_ANY_COMMAND


class WorkerTestLinePolicy(EventPolicy):
    """A worker runs a test only through its named test commands; any other test line is refused."""

    key = "workers.named-tests-only"
    # a worker runs tests only through its named commands, which is said before any limit on what it may run
    rank = "workers.test-lines"
    agent_types = [Worker.key]


    def __init__(self, commands: BackgroundCommands, names: WorkerTestNames, settings: SettingValues) -> None:
        self.commands, self.names, self.settings = commands, names, settings

    def refusal(self, event: HookEvent, agent_id: int) -> AgentMessage | None:
        tool = event.tool
        if tool is None or tool.shell is None or self.settings.flag(WORKERS_RUN_ANY_COMMAND):
            return None
        for part in tool.shell.parts:
            if self.commands.part_command(part, tool.shell).category is CommandCategory.TEST_RUN and not WorkerTestNames.is_worker_test(part) and not ASKING_FLAGS.intersection(part.arguments):
                return self.refused_line(agent_id)
        return None

    def refused_line(self, worker_id: int) -> AgentMessage:
        names = self.names.names_text(worker_id)
        return WorkerTestLineRefusalMessage.declared().agent_message(names=names) if names else WorkerTestCommandsMissingMessage.declared().agent_message(worker=worker_id)
