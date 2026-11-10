from engine.enums.agent_role import AgentRole
from core.base.command.context import Context
from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.listener.save_listener import SaveListener
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.base.scope.actor_scope import ActorScope
from core.modules.agents.models.agent import Agent
from core.modules.drivers.support.nudger import Nudger
from core.modules.processes.models.enums.process_state import ProcessState
from core.modules.processes.models.process import Process
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task
from suites.coding.support.test_run_nudges import TESTING_TASKS_FAILED_RUN, TESTING_TASKS_FULL_RUN
from core.base.change.created import Created
from core.modules.processes.events.process_ended import ProcessEnded

SOURCE = "tasks.full-test-run"


class FullTestRunListener(SaveListener[Created[Process] | ProcessEnded]):
    """A run of the whole test suite names the tasks in testing when it starts; when it passes it closes those
    that were in testing before it started, and when it fails it names them. A worker's tasks wait for its
    merge."""

    name = "tasks.full-test-run"
    disabled_scopes = [ActorScope]

    def __init__(self, queries: Queries, repository: Repository, nudger: Nudger) -> None:
        self.queries, self.repository, self.nudger = queries, repository, nudger

    def handle(self, event: Created[Process] | ProcessEnded, context: Context) -> None:
        run = event.row
        if not run.is_full_test_run:
            return
        if isinstance(event, Created):
            self.line_sender(run, self.testing_tasks(run), TESTING_TASKS_FULL_RUN, context)
            return
        self.ended(run, context)

    def ended(self, run: Process, context: Context) -> None:
        tasks = self.testing_tasks(run)
        if run.state is not ProcessState.FINISHED:
            self.line_sender(run, tasks, TESTING_TASKS_FAILED_RUN, context)
            return
        for task in tasks:
            self.repository.save(task.close(context.timestamp, context.actor, f"the full test run, process {run.id}, passed"), context)

    def line_sender(self, run: Process, tasks: tuple[Task, ...], declaration: NudgeDeclaration, context: Context) -> None:
        if tasks:
            names = ", ".join(f"task:{task.id}" for task in tasks)
            self.nudger.send(run.session_agent_id, declaration, SOURCE, context, tasks=names)

    def testing_tasks(self, run: Process) -> tuple[Task, ...]:
        testing = tuple(self.queries.query(Task).filter(state=TaskState.TESTING).oldest().all_rows())
        roles = {agent.id: agent.role for agent in self.queries.query(Agent).find_many(sorted({task.delegated_to for task in testing if task.delegated_to is not None}))}
        waiting = [task for task in testing if task.delegated_to is None or roles[task.delegated_to] == AgentRole.MAIN]
        return tuple(task for task in waiting if task.updated_at is not None and run.created_at is not None and task.updated_at <= run.created_at)
