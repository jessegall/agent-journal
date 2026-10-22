from journal.features.tasks.support.task_succession import TaskSuccession
from journal.engine.conduct import Conduct
from journal.engine.support.settings import Settings
from journal.engine.support.transition import Transition
from journal.events.agent.wait_request import WaitRequest
from journal.events.agent.impasse_report import ImpasseReport
from journal.events.agent.tool_starting import ToolStarting
from journal.events.rows.task_closed import TaskClosed
from journal.events.rows.task_reopened import TaskReopened

POLL_REPEAT_COMMANDS = 3


class TasksConduct(Conduct):
    """The tasks feature's conduct in every state: a polled command named, a task open again told, a parked task named when a task closes, a wait the agent declares pushed as Expecting and a stuck agent pushed as Stuck."""

    def on_wait_request(self, event: WaitRequest, settings: Settings) -> Transition:
        from journal.features.tasks.states.external_wait import ExternalWait
        return self.push(ExternalWait.opened(*event.wait_terms()))

    def on_impasse_report(self, event: ImpasseReport, settings: Settings) -> Transition:
        from journal.features.tasks.states.impasse import Impasse
        return self.push(Impasse(reason=event.reason))

    def on_tool_starting(self, event: ToolStarting, settings: Settings) -> Transition:
        from journal.features.tasks.feature import Tasks
        command = event.call.command
        last = event.data.part(Tasks).last_commands
        if not command or len(last) < POLL_REPEAT_COMMANDS or any(older != command for older in last):
            return self.none()
        return self.none(Tasks.STOP_POLLING.create(times=POLL_REPEAT_COMMANDS, command=command))

    def on_task_reopened(self, event: TaskReopened, settings: Settings) -> Transition:
        from journal.features.tasks.feature import Tasks
        return self.none(Tasks.TASK_REOPENED.create(n=event.task_id, reason=event.reason))

    def on_task_closed(self, event: TaskClosed, settings: Settings) -> Transition:
        from journal.features.tasks.feature import Tasks
        tasks = event.data.part(Tasks)
        if event.outcome != "done" or tasks.current_task or not tasks.suspended or event.data.part(TaskSuccession):
            return self.none()
        return self.none(Tasks.SUSPENDED_TASK_CLOSURE_REMINDER.create(n=tasks.suspended[0], why=tasks.first_suspension_reason))
