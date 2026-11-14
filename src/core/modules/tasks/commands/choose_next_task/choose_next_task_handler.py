from engine.enums.actor_type import ActorType
from engine.enums.agent_role import AgentRole
from engine.command.context import Context
from engine.command.handler import Handler
from engine.query.queries import Queries
from engine.errors.refusal import Refusal
from core.modules.agents.models.agent import Agent
from core.modules.tasks.commands.choose_next_task.choose_next_task import ChooseNextTask
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task
from core.modules.assignments.support.assignments import Assignments
from core.modules.tasks.support.assignee_label import AssigneeLabel
from core.modules.tasks.support.next_task_choices import NextTaskChoices


class ChooseNextTaskHandler(Handler[ChooseNextTask, Task]):
    """Remembers one open task as the next for an agent, replacing an earlier choice; the task must be free for
    that agent or assigned to it, and only a main agent or a user chooses for another agent."""

    command = ChooseNextTask

    def __init__(self, queries: Queries, choices: NextTaskChoices, assignments: Assignments, labels: AssigneeLabel) -> None:
        self.queries, self.choices, self.assignments, self.labels = queries, choices, assignments, labels

    def handle(self, command: ChooseNextTask, context: Context) -> Task:
        agent_id = context.actor.id if command.agent_id is None else command.agent_id
        self.check_chooser(agent_id, context)
        task = self.queries.query(Task).find(command.task_id)
        if task.state is not TaskState.OPEN:
            raise Refusal(f"task {task.id} is {task.state.value}: only an open task can be next")
        assignee_id = self.assignments.actor(task)
        if assignee_id is not None and assignee_id != agent_id:
            raise Refusal(f"task {task.id} is assigned to {self.labels.text(assignee_id)}", "give it to this agent first")
        self.choices.choose(self.queries.query(Agent).find(agent_id), task, context)
        return task

    def check_chooser(self, agent_id: int, context: Context) -> None:
        if agent_id == context.actor.id or not context.actor.is_agent():
            return
        if not self.queries.query(Agent).find(context.actor.id).is_main:
            raise Refusal("only a main agent chooses the next task of another agent", "choose your own next task")
