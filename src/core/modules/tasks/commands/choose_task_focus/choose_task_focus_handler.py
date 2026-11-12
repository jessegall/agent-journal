from engine.command.context import Context
from engine.command.handler import Handler
from engine.errors.refusal import Refusal
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.agents.support.main_agent_finder import MainAgentFinder
from core.modules.tasks.commands.choose_task_focus.choose_task_focus import ChooseTaskFocus
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task
from core.modules.tasks.queries.task_query import TaskQuery

PERSON_HEADING = "the task of the main agent:"
CLEARED_LINE = "the task you work on is the one you started last again"
WITHOUT_STARTED_TASK_LINE = "you have no started task"


class ChooseTaskFocusHandler(Handler[ChooseTaskFocus, tuple[str, ...]]):
    """Makes one of the asking agent's started tasks the task it works on now, so the reminders and the
    status name that task, and answers with the task in hand and the started tasks behind it. Starting a
    task makes that one the task in hand again. A task that is not started, or that another agent started,
    is refused. A user reads and sets the task of the running main agent."""

    command = ChooseTaskFocus

    def __init__(self, queries: Queries, tasks: TaskQuery, repository: Repository) -> None:
        self.queries, self.tasks, self.repository = queries, tasks, repository

    def handle(self, command: ChooseTaskFocus, context: Context) -> tuple[str, ...]:
        is_person = not context.actor.is_agent()
        agent_id = self.main_agent_id() if is_person else context.actor.id
        heading = [PERSON_HEADING] if is_person else []
        if command.clears:
            for task in self.tasks.started_tasks(agent_id):
                if task.focused_at is not None:
                    self.repository.save(task.focused(None), context)
            return (*heading, CLEARED_LINE, *self.lines(agent_id))
        if command.task_id is not None:
            self.repository.save(self.started_task(command.task_id, agent_id).focused(context.timestamp), context)
        return (*heading, *self.lines(agent_id))

    def main_agent_id(self) -> int:
        main_agent = MainAgentFinder.newest(self.queries)
        if main_agent is None:
            raise Refusal("no main agent is running, so there is no task in hand to read or set", "journal launch")
        return main_agent.id

    def started_task(self, task_id: int, agent_id: int) -> Task:
        task = self.queries.query(Task).filter(id=task_id).first()
        if task is None:
            raise Refusal("no such task", "journal task list --state started")
        if task.state is not TaskState.STARTED:
            raise Refusal(f"task {task.id} is {task.state.value}: only a started task is worked on now", f"journal task start {task.id}")
        if task.holder_id != agent_id:
            raise Refusal(f"task {task.id} is started by another agent", "journal task list --state started")
        return task

    def lines(self, agent_id: int) -> tuple[str, ...]:
        started = self.tasks.started_tasks(agent_id)
        if not started:
            return tuple([WITHOUT_STARTED_TASK_LINE])
        return (f"you work on task {started[0].id} now: {started[0].title}",
                *(f"also started: task {task.id}, {task.title}" for task in started[1:]))
