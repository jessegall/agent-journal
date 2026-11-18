from journal.engine.command_events import CommandEvents
from journal.features.workers.states.working_task import WorkingTask
from journal.models.support.ref import Ref
from journal.models.worker import Worker
from journal.models.worker_state import WorkerState
from journal.repositories.agents import Agents
from journal.repositories.tasks import Tasks


class WorkerAssigner:
    """Puts a worker to work on the task it holds, once its session has an agent row, at its clock-in and at each hook of its session that finds it out on the task while resting on Void: Void, the helper's floor, hears the assignment and pushes WorkingTask over itself; a worker sent back or sent a job on a task its clock-in already started is put to work without clocking in again, and a pool worker on the machine that runs it is put to work at its clock-in, since its clock-in is made on the journal that dispatched it."""

    def __init__(self, tasks: Tasks, agents: Agents, events: CommandEvents) -> None:
        self.tasks, self.agents, self.events = tasks, agents, events

    def assigned(self, row: Worker) -> None:
        if row.state == WorkerState.READY or (row.is_dispatched() and self.is_on_started_task(row)):
            self.assign(row)

    def is_on_started_task(self, row: Worker) -> bool:
        task_ids = self.tasks.holder_task_ids(Ref.build(row))
        return bool(task_ids) and self.tasks.find(task_ids[0]).is_started()

    def assign(self, row: Worker) -> None:
        task_ids = self.tasks.holder_task_ids(Ref.build(row))
        agents = self.agents.session_rows(row.session) if row.session else []
        if task_ids and agents:
            self.events.helper_assigned(WorkingTask(task_id=task_ids[0]), agents[0])
