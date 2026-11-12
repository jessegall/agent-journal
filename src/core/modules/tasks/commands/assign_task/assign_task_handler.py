from engine.command.context import Context
from engine.command.handler import Handler
from engine.query.queries import Queries
from engine.errors.refusal import Refusal
from engine.repository.repository import Repository
from core.modules.actors.models.actor_record import ActorRecord
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_label import AgentLabel
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.assignments.support.assignments import Assignments
from core.modules.tasks.commands.assign_task.assign_task import AssignTask
from core.modules.tasks.models.enums.task_state import UNFINISHED_STATES, TaskState
from core.modules.tasks.models.task import Task
from core.modules.tasks.support.task_assignees import TaskAssignees


class AssignTaskHandler(Handler[AssignTask, Task]):
    """Gives an unfinished task to a person or an agent, after the suite checks an agent assignee. A task another
    actor holds is let go in the same command: a started or testing one opens again and a blocked one stays
    blocked without a holder, so the task never shows the new actor while another holds it. Only a person or the
    main agent assigns."""

    command = AssignTask

    def __init__(self, queries: Queries, repository: Repository, assignees: TaskAssignees, assignments: Assignments, agents: AgentRows) -> None:
        self.queries, self.repository, self.assignees = queries, repository, assignees
        self.assignments, self.agents = assignments, agents

    def handle(self, command: AssignTask, context: Context) -> Task:
        self.agents.require_main(context.actor, "assign a task")
        task = self.queries.query(Task).find(command.task_id)
        if task.state not in UNFINISHED_STATES:
            raise Refusal(f"task {task.id} is {task.state.value}: only an unfinished task moves")
        self.assignments.require_working_actor(command.actor_id)
        agent = self.queries.query(Agent).filter(id=command.actor_id).first()
        if agent is not None:
            self.assignees.check_running(agent)
        task = self.let_go(task, command.actor_id, self.label(command.actor_id, agent), context)
        self.assignments.assign(task, command.actor_id, context, cascade=False)
        return task

    def let_go(self, task: Task, actor_id: int, label: str, context: Context) -> Task:
        if task.holder_id in (None, actor_id):
            return task
        self.assignees.check_reassignment(task)
        if task.state is TaskState.BLOCKED:
            return self.repository.save(task.drop_hold(context.timestamp, context.actor, f"assigned to {label}"), context)
        return self.repository.save(task.release(context.timestamp, context.actor, f"assigned to {label}"), context)

    def label(self, actor_id: int, agent: Agent | None) -> str:
        if agent is not None:
            return AgentLabel.from_agent(agent).text
        return self.queries.query(ActorRecord).find(actor_id).name
