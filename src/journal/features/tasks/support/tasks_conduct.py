from journal.engine.conduct import Conduct
from journal.engine.support.settings import Settings
from journal.engine.support.transition import Transition
from journal.events.agent.tool_starting import ToolStarting
from journal.events.rows.task_closed import TaskClosed
from journal.events.rows.task_reopened import TaskReopened

SAME = 3


class TasksConduct(Conduct):
    """The tasks feature's conduct in every state: a polled command named, a task open again told, a parked task named when a task closes."""

    def on_tool_starting_tasks(self, event: ToolStarting, settings: Settings) -> Transition:
        from journal.features.tasks.feature import Tasks
        command = event.call.command
        last = event.snapshot.of(Tasks).last_commands
        if not command or len(last) < SAME or any(earlier != command for earlier in last):
            return self.unchanged()
        return self.unchanged(Tasks.STOP_POLLING.create(times=SAME, command=command))

    def on_task_reopened_tasks(self, event: TaskReopened, settings: Settings) -> Transition:
        from journal.features.tasks.feature import Tasks
        return self.unchanged(Tasks.TASK_REOPENED.create(n=event.task_id, on=event.on))

    def on_task_closed_tasks(self, event: TaskClosed, settings: Settings) -> Transition:
        from journal.features.plans.feature import Plans
        from journal.features.tasks.feature import Tasks
        tasks, plans = event.snapshot.of(Tasks), event.snapshot.of(Plans)
        if event.how != "done" or tasks.in_hand or not tasks.parked or (plans.started is not None and plans.started.next_task):
            return self.unchanged()
        return self.unchanged(Tasks.PARKED_TASK_NAMED_AT_CLOSE.create(n=tasks.parked[0], why=tasks.first_parked_why))
