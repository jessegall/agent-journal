from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.modules.tasks.commands.start_task.start_task import StartTask
from suites.coding.support.available_work import AvailableWork
from suites.coding.support.coding_main_options import CodingMainOptions
from suites.coding.support.free_place_notices import FreePlaceNotices
from suites.coding.support.coding_nudges import FREE_WORKER_PLACE, OPEN_TASKS_WAIT, TASK_ASSIGNMENT


class MainStopRule(DriverRule):
    """A main agent that stops is handed the next task when it may work on it, and is held back while a task
    can still be sent to a worker and its work controls ask it to keep going; with nothing it can do it may
    stop. While a task can go to a worker and a place is free, a stop is held once for each state of the
    tasks and places, so the agent sends them or says why not."""

    name = "coding.main-stop"
    hook = HookEventName.STOP

    def __init__(self, work: AvailableWork, options: CodingMainOptions, notices: FreePlaceNotices) -> None:
        self.work, self.options, self.notices = work, options, notices

    def answer(self, hook: AgentHook) -> RuleAnswer:
        available = self.work.answer(hook.agent_id)
        if available.own_task is not None:
            return RuleAnswer.refused(TASK_ASSIGNMENT.nudge(task=available.own_task.id)).running(StartTask(available.own_task.id))
        if available.delegatable and self.options.options().keeps_going:
            return RuleAnswer.refused(OPEN_TASKS_WAIT.nudge(tasks=", ".join(str(task_id) for task_id in available.delegatable)))
        if available.delegatable:
            notice = FREE_WORKER_PLACE.nudge(count=available.free_places, tasks=", ".join(str(task_id) for task_id in available.delegatable))
            if not self.notices.has_notice(hook.agent_id, notice.text):
                return RuleAnswer.refused(notice)
        return RuleAnswer.allowed("no task can be handed to the main agent or sent to a worker")
