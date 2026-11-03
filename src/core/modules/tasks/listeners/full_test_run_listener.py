from core.base.change.change import Change
from core.base.command.context import Context
from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.listener.save_listener import SaveListener
from core.base.model.model import Model
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.drivers.support.nudger import Nudger
from core.modules.processes.models.enums.process_state import ProcessState
from core.modules.processes.models.process import Process
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task
from core.modules.tasks.support.task_nudges import TESTING_TASKS_FAILED_RUN, TESTING_TASKS_FULL_RUN

SOURCE = "tasks.full-test-run"


class FullTestRunListener(SaveListener):
    """A run of the whole test suite names the tasks in testing when it starts; when it passes it closes those
    that were in testing before it started, and when it fails it names them. A worker's tasks wait for its
    merge."""

    name = "tasks.full-test-run"
    event = "process.*"

    def __init__(self, queries: Queries, repository: Repository, nudger: Nudger) -> None:
        self.queries, self.repository, self.nudger = queries, repository, nudger

    def handle(self, change: Change[Model]) -> None:
        run, old = change.new_row, change.old_row
        if not isinstance(run, Process) or not run.is_full_test_run:
            return
        if old is None:
            self.send_line(run, self.testing_tasks(run), TESTING_TASKS_FULL_RUN, change.context)
            return
        if isinstance(old, Process) and self.ended_with(old, run):
            self.ended(run, change.context)

    def ended_with(self, old: Process, run: Process) -> bool:
        return old.ended_at is None and run.ended_at is not None

    def ended(self, run: Process, context: Context) -> None:
        tasks = self.testing_tasks(run)
        if run.state is not ProcessState.FINISHED:
            self.send_line(run, tasks, TESTING_TASKS_FAILED_RUN, context)
            return
        for task in tasks:
            self.repository.save(task.close(context.timestamp, context.actor, f"the full test run, process {run.id}, passed"), context)

    def send_line(self, run: Process, tasks: tuple[Task, ...], declaration: NudgeDeclaration, context: Context) -> None:
        if tasks:
            names = ", ".join(f"task:{task.id}" for task in tasks)
            self.nudger.say(run.agent_id, declaration, SOURCE, context, tasks=names)

    def testing_tasks(self, run: Process) -> tuple[Task, ...]:
        waiting = self.queries.query(Task).filter(environment_id=run.environment_id, state=TaskState.TESTING).matching(IsNull("delegated_to")).oldest().all_rows()
        return tuple(task for task in waiting if task.updated_at is not None and run.created_at is not None and task.updated_at <= run.created_at)
