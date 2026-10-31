from core.base.command.bus import Bus
from core.base.driver.driver_rule import DriverRule
from core.base.driver.rule_answer import RuleAnswer
from core.modules.tasks.commands import TaskStart
from core.modules.tasks.task_query import TaskQuery


class SampleStart(DriverRule):
    name = "samples.start"
    hook = "stop"

    def __init__(self, bus: Bus, tasks: TaskQuery) -> None:
        self.bus, self.tasks = bus, tasks

    def answer(self, hook):
        # @sin architecture_drivers_RuleRunsNoCommandDetector
        self.bus.run(TaskStart(1))
        # @righteous architecture_drivers_RuleRunsNoCommandDetector
        return RuleAnswer.allowed().running(TaskStart(1))


class SampleReader(DriverRule):
    name = "samples.reader"
    hook = "stop"

    def answer(self, hook):
        # @sin architecture_drivers_RuleBuildsNoReaderDetector
        tasks = TaskQuery(None, None)
        # @righteous architecture_drivers_RuleBuildsNoReaderDetector
        return RuleAnswer.allowed() if tasks else RuleAnswer.allowed()
