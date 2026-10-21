from journal.engine.conduct import Conduct
from journal.engine.support.settings import Settings
from journal.engine.support.transition import Transition
from journal.events.agent.wait_request import WaitRequest
from journal.events.agent.impasse_report import ImpasseReport
from journal.events.agent.tool_starting import ToolStarting
from journal.events.rows.task_closed import TaskClosed
from journal.events.rows.task_reopened import TaskReopened

POLL_REPEAT_LIMIT = 3


class TasksConduct(Conduct):
    """The tasks feature's conduct in every state: a polled command named, a task open again told, a parked task named when a task closes, a wait the agent declares pushed as Expecting and a stuck agent pushed as Stuck."""

    def on_wait_request_tasks(self, event: WaitRequest, settings: Settings) -> Transition:
        from journal.features.tasks.states.external_wait import ExternalWait
        return self.push(ExternalWait(what=event.what, ends_on=event.ends_on, start_time=event.time))

    def on_impasse_report_tasks(self, event: ImpasseReport, settings: Settings) -> Transition:
        from journal.features.tasks.states.impasse import Impasse
        return self.push(Impasse(why=event.why))

    def on_tool_starting_tasks(self, event: ToolStarting, settings: Settings) -> Transition:
        from journal.features.tasks.feature import Tasks
        command = event.call.command
        last = event.data.part(Tasks).last_commands
        if not command or len(last) < POLL_REPEAT_LIMIT or any(earlier != command for earlier in last):
            return self.none()
        return self.none(Tasks.STOP_POLLING.create(times=POLL_REPEAT_LIMIT, command=command))

    def on_task_reopened_tasks(self, event: TaskReopened, settings: Settings) -> Transition:
        from journal.features.tasks.feature import Tasks
        return self.none(Tasks.TASK_REOPENED.create(n=event.task_id, on=event.on))

    def on_task_closed_tasks(self, event: TaskClosed, settings: Settings) -> Transition:
        from journal.features.plans.feature import Plans
        from journal.features.tasks.feature import Tasks
        tasks, plans = event.data.part(Tasks), event.data.part(Plans)
        if event.how != "done" or tasks.in_hand or not tasks.parked or (plans.started is not None and plans.started.next_task):
            return self.none()
        return self.none(Tasks.SUSPENDED_TASK_CLOSURE_REMINDER.create(n=tasks.parked[0], why=tasks.first_parked_why))
