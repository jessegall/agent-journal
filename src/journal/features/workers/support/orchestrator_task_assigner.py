from journal.engine.support.assignment import Assignment
from journal.events.agent.agent_event import AgentEvent
from journal.events.agent.next_tasks_request import NextTasksRequest
from journal.events.agent.stop import Stop
from journal.events.rows.row_event import RowEvent
from journal.events.rows.task_closed import TaskClosed
from journal.features.plans.support.approved_plan_start import ApprovedPlanStart
from journal.features.tasks.support.round_robin_delivery import RoundRobinDelivery
from journal.features.tasks.tasks_options import TasksOptions
from journal.models.agent import Agent
from journal.models.task import Task
from journal.repositories.plans import Plans
from journal.repositories.setting_rows import SettingRows


class OrchestratorTaskAssigner:
    """The task assigner the orchestrator's floor names: its next task is the one it hands a worker, never one it starts itself; at its stop, when a task closes or when the orchestrator asks with journal task next, it opens the oldest approved plan, with no task in hand, and names the next tasks of its started plans in turn, round robin, and in auto mode free tasks after them."""

    def __init__(self, start: ApprovedPlanStart, round_robin: RoundRobinDelivery, plans: Plans, settings: SettingRows) -> None:
        self.start, self.round_robin, self.plans, self.settings = start, round_robin, plans, settings

    def next_task(self, agent: Agent, event: AgentEvent | RowEvent, quantity: int = 1) -> Assignment:
        if not agent.is_main() or not self.is_moment(agent, event):
            return Assignment()
        tasks = self.offers()[:max(quantity, 1)]
        if not tasks:
            return Assignment()
        return Assignment(tasks[0].row_id, tasks[0].title, "the next task to hand a worker, plan by plan in turn", tuple(task.row_id for task in tasks[1:]))

    @staticmethod
    def is_moment(agent: Agent, event: AgentEvent | RowEvent) -> bool:
        return isinstance(event, TaskClosed) or (isinstance(event, (Stop, NextTasksRequest)) and event.session == agent.session)

    def offers(self) -> list[Task]:
        self.start.opened()
        return self.delegable_tasks()

    def delegable_tasks(self) -> list[Task]:
        return self.round_robin.offers() if self.settings.option(TasksOptions.AUTO) else self.round_robin.planned_offers(self.plans.offering_plans())
