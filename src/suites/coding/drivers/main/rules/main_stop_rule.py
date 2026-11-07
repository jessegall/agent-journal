from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.modules.tasks.commands.start_task.start_task import StartTask
from suites.coding.support.available_work import AvailableWork
from suites.coding.support.coding_main_options import CodingMainOptions
from suites.coding.support.coding_nudges import OPEN_TASKS_WAIT, TASK_ASSIGNMENT


class MainStopRule(DriverRule):
    """A main agent that stops is handed the next task when it may work on it, and is held back while a task can still be
    sent to a worker and its work controls ask it to keep going; with nothing it can do it may stop."""

    name = "coding.main-stop"
    hook = HookEventName.STOP

    def __init__(self, work: AvailableWork, options: CodingMainOptions) -> None:
        self.work, self.options = work, options

    def answer(self, hook: AgentHook) -> RuleAnswer:
        available = self.work.answer(hook.agent_id)
        if available.own_task is not None:
            return RuleAnswer.refused(TASK_ASSIGNMENT.nudge(task=available.own_task.id)).running(StartTask(available.own_task.id))
        if available.delegatable and self.options.options().keeps_going:
            return RuleAnswer.refused(OPEN_TASKS_WAIT.nudge(tasks=", ".join(str(task_id) for task_id in available.delegatable)))
        return RuleAnswer.allowed("no task can be handed to the main agent or sent to a worker")
