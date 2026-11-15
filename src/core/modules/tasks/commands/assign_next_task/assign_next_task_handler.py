from engine.command.bus import Bus
from engine.command.context import Context
from engine.command.handler import Handler
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.tasks.commands.assign_next_task.assign_next_task import AssignNextTask
from core.modules.tasks.commands.start_task.start_task import StartTask
from core.modules.tasks.support.current_tasks import CurrentTasks
from core.modules.tasks.support.suite_task_assigners import SuiteTaskAssigners


class AssignNextTaskHandler(Handler[AssignNextTask, None]):
    """While the suite's assigner hands out tasks by itself, starts the agent's next task: an urgent one while
    it holds others, else the one the assigner gives next, its plan focus among them. An agent that ended or
    is past its context limit gets none."""

    command = AssignNextTask

    def __init__(self, agents: AgentRows, current: CurrentTasks, assigners: SuiteTaskAssigners, bus: Bus) -> None:
        self.agents, self.current, self.assigners, self.bus = agents, current, assigners, bus

    def handle(self, command: AssignNextTask, context: Context) -> None:
        agent, assigner = self.agents.find(command.agent_id), self.assigners.assigner()
        if assigner is None or not assigner.is_automatic() or not self.agents.is_main(agent.id) or agent.ended_at is not None or assigner.exceeds_context_limit(agent.id):
            return
        following = assigner.urgent() if self.current.started_tasks(agent.id) else assigner.following(agent.id)
        if following is not None:
            self.bus.dispatch(StartTask(following.id), context)
