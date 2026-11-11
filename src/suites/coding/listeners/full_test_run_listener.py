from engine.query.conditions.among import Among
from core.modules.assignments.support.assignments import Assignments
from engine.enums.agent_role import AgentRole
from engine.command.context import Context
from engine.driver.nudge_declaration import NudgeDeclaration
from engine.listener.save_listener import SaveListener
from engine.query.queries import Queries
from engine.repository.repository import Repository
from engine.scope.actor_scope import ActorScope
from core.modules.agents.models.agent import Agent
from engine.driver.nudger import Nudger
from core.modules.processes.models.enums.process_state import ProcessState
from core.modules.processes.models.process import Process
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task
from suites.coding.support.test_run_nudges import TESTING_TASKS_FAILED_RUN, TESTING_TASKS_FULL_RUN
from engine.event.created import Created
from core.modules.processes.events.process_ended import ProcessEnded

SOURCE = "tasks.full-test-run"


class FullTestRunListener(SaveListener[Created[Process] | ProcessEnded]):
    """A run of the whole test suite names the tasks in testing when it starts; when it passes it closes those
    that were in testing before it started, and when it fails it names them. A worker's tasks wait for its
    merge."""

    name = "tasks.full-test-run"
    disabled_scopes = [ActorScope]

    def __init__(self, queries: Queries, repository: Repository, nudger: Nudger, assignments: Assignments) -> None:
        self.queries, self.repository, self.nudger, self.assignments = queries, repository, nudger, assignments

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
        actor_ids = self.assignments.row_actor_ids(Task, [task.id for task in testing])
        assigned_ids = sorted({actor_id for ids in actor_ids.values() for actor_id in ids})
        roles = {agent.id: agent.role for agent in self.queries.query(Agent).matching(Among("id", assigned_ids)).all_rows()} if assigned_ids else {}
        waiting = [task for task in testing if all(roles.get(actor_id) == AgentRole.MAIN for actor_id in actor_ids.get(task.id, ()))]
        return tuple(task for task in waiting if task.updated_at is not None and run.created_at is not None and task.updated_at <= run.created_at)
