from core.base.command.bus import Bus
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.modules.tasks.commands import StartTask
from core.modules.tasks.queries.task_query import TaskQuery


class SampleStart(DriverRule):
    name = "samples.start"
    hook = HookEventName.STOP

    def __init__(self, bus: Bus, tasks: TaskQuery) -> None:
        self.bus, self.tasks = bus, tasks

    def answer(self, hook):
        # @sin architecture_drivers_rule_runs_a_command
        self.bus.run(StartTask(1))
        # @righteous architecture_drivers_rule_runs_a_command
        return RuleAnswer.allowed().running(StartTask(1))


class SampleReader(DriverRule):
    name = "samples.reader"
    hook = HookEventName.STOP

    def answer(self, hook):
        # @sin architecture_drivers_rule_builds_its_reader
        tasks = TaskQuery(None, None)
        # @righteous architecture_drivers_rule_builds_its_reader
        return RuleAnswer.allowed() if tasks else RuleAnswer.allowed()
