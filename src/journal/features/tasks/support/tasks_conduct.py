from journal.engine.conduct import Conduct
from journal.engine.support.settings import Settings
from journal.engine.support.transition import Transition
from journal.events.agent.tool_starting import ToolStarting
from journal.events.rows.task_closed import TaskClosed
from journal.events.rows.task_opened_again import TaskOpenedAgain

SAME = 3


class TasksConduct(Conduct):
    """The tasks feature's conduct in every state: a polled command named, a task open again told, a parked task named when a task closes."""

    def on_tool_starting_tasks(self, event: ToolStarting, settings: Settings) -> Transition:
        from journal.features.tasks.feature import Tasks
        command = event.input.get("command", "") if event.tool == "Bash" else ""
        last = event.standing.of(Tasks).last_commands
        if not command or len(last) < SAME - 1 or any(seen != command for seen in last):
            return self.unchanged()
        return self.unchanged(Tasks.STOP_POLLING.create(times=SAME, command=command))

    def on_task_opened_again_tasks(self, event: TaskOpenedAgain, settings: Settings) -> Transition:
        from journal.features.tasks.feature import Tasks
        return self.unchanged(Tasks.TASK_OPEN_AGAIN.create(n=event.task_id, on=event.on))

    def on_task_closed_tasks(self, event: TaskClosed, settings: Settings) -> Transition:
        from journal.features.plans.feature import Plans
        from journal.features.tasks.feature import Tasks
        tasks, plans = event.standing.of(Tasks), event.standing.of(Plans)
        if event.how != "done" or tasks.in_hand or not tasks.parked or (plans.started is not None and plans.started.next_task):
            return self.unchanged()
        return self.unchanged(Tasks.CONTINUE_THE_PARKED_TASK_AT_CLOSE.create(n=tasks.parked[0], why=tasks.first_parked_why))
