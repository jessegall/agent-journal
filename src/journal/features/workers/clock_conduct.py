from journal.engine.conduct import Conduct
from journal.engine.support.settings import Settings
from journal.engine.support.transition import Transition
from journal.events.agent.command_ended import CommandEnded
from journal.events.agent.stop import Stop
from journal.events.agent.tool_starting import ToolStarting
from journal.events.rows.task_briefed import TaskBriefed
from journal.events.rows.task_closed import TaskClosed
from journal.events.rows.worker_delivered import WorkerDelivered
from journal.events.rows.worker_ready import WorkerReady
from journal.features.tasks.feature import Tasks
from journal.features.tasks.states.working import Working
from journal.features.workers.listeners.worker_task_changes import RELEASING
from journal.models.worker_state import WorkerState


class ClockConduct(Conduct):
    """A worker's own conduct in every state: its writes wait until it clocks in, saying only that; clocking in puts it to work on the task it holds, a stop is held while an output of its own runs and told the end of one that ended, and told the to-do items still open, the user closing its task ends its work and the user rewriting its brief names the points to prove again, and clocking out ends that work, so it may stop."""

    def on_tool_starting(self, event: ToolStarting, settings: Settings) -> Transition:
        from journal.features.workers.feature import Workers
        rows = event.data.part(Workers).session_workers
        if event.call.writes and rows and rows[0].state == WorkerState.DISPATCHED:
            return self.refuse(Workers.READINESS.create())
        return self.none()

    def on_stop(self, event: Stop, settings: Settings) -> Transition:
        from journal.features.workers.feature import Workers
        unfinished = event.data.part(Workers).unfinished_outputs
        if unfinished:
            return self.refuse(Workers.OUTPUT_UNFINISHED.create(n=unfinished[0]))
        items = [item for item in event.data.part(Workers).todos if not item.complete]
        return self.none(Workers.OPEN_TODOS.create(count=len(items), items="; ".join(f"{item.position}. {item.text}" for item in items))) if items else self.none()

    def on_command_ended(self, event: CommandEnded, settings: Settings) -> Transition:
        from journal.features.workers.feature import Workers
        return self.none(Workers.OUTPUT_END.create(n=event.output, status=event.status))

    def on_task_closed(self, event: TaskClosed, settings: Settings) -> Transition:
        from journal.features.workers.feature import Workers
        if event.task_id not in event.data.part(Tasks).agent_tasks or event.outcome not in RELEASING:
            return self.none()
        return self.pop(Workers.USER_CLOSURE.create(task=event.task_id))

    def on_task_briefed(self, event: TaskBriefed, settings: Settings) -> Transition:
        from journal.features.workers.feature import Workers
        if event.task_id not in event.data.part(Tasks).agent_tasks or not event.points:
            return self.none()
        return self.none(Workers.BRIEF_CHANGED.create(task=event.task_id, points=", ".join(map(str, event.points))))

    def on_worker_ready(self, event: WorkerReady, settings: Settings) -> Transition:
        holdings = event.data.part(Tasks).agent_tasks
        return self.push(Working(task_id=holdings[0])) if holdings else self.none()

    def on_worker_delivered(self, event: WorkerDelivered, settings: Settings) -> Transition:
        return self.pop()
