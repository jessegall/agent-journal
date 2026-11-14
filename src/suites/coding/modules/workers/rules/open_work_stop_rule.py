from engine.enums.agent_role import AgentRole
from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_event_name import HookEventName
from engine.driver.rule_answer import RuleAnswer
from core.modules.tasks.commands.start_task.start_task import StartTask
from suites.coding.modules.workers.support.available_work import AvailableWork
from suites.coding.modules.workers.support.main_agent_work import MainAgentWork
from suites.coding.support.next_task import NextTask
from suites.coding.support.stop_notices import UNFINISHED_TASKS_TEXT, StopNotices
from suites.coding.support.coding_nudges import TASK_ASSIGNMENT, UNFINISHED_TASKS


class OpenWorkStopRule(DriverRule):
    """A main agent that stops is handed the next task when it may work on it; with nothing it can do it may
    stop. The journal never urges it to send a task to a worker: free worker places are a limit. While it has
    unfinished tasks of its own and waits on nothing, a stop is held once for each set of those tasks, so it
    starts one, blocks it or says why not, unless the stop is the one that compacts its context."""

    name = "coding.main-stop"
    hook = HookEventName.STOP
    drivers = ["coding.main"]
    roles = [AgentRole.MAIN]
    single_action_refusal = "A main agent that stops is handed the next task when it may work on it, and is held back while it has unfinished tasks of its own"

    def __init__(self, work: AvailableWork, notices: StopNotices, unfinished_work: MainAgentWork, assigner: NextTask) -> None:
        self.work, self.notices, self.unfinished_work, self.assigner = work, notices, unfinished_work, assigner

    def answer(self, hook: AgentHook) -> RuleAnswer:
        available = self.work.answer(hook.agent_id)
        if available.assigned_task is not None:
            return RuleAnswer.refused(TASK_ASSIGNMENT.nudge(task=available.assigned_task.id)).running(StartTask(available.assigned_task.id))
        return self.unfinished_answer(hook)

    def unfinished_answer(self, hook: AgentHook) -> RuleAnswer:
        if self.work.is_stop_compacting(hook.agent_id):
            return RuleAnswer.allowed("this stop compacts the context of the main agent")
        task_ids = self.assigner.agent_tasks([hook.agent_id]).get(hook.agent_id, ())
        if task_ids and hook.agent_id not in self.unfinished_work.waiting_agents([hook.agent_id], hook.timestamp):
            notice = UNFINISHED_TASKS.nudge(tasks=", ".join(str(task_id) for task_id in task_ids))
            if not self.notices.has_notice(hook.agent_id, notice.text, UNFINISHED_TASKS_TEXT):
                return RuleAnswer.refused(notice)
        return RuleAnswer.allowed("no task can be handed to the main agent or sent to a worker")
