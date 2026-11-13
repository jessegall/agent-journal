from engine.command.context import Context
from engine.command.handler import Handler
from engine.driver.nudge import Nudge
from engine.driver.nudger import Nudger
from engine.query.queries import Queries
from engine.scope.actor_scope import ActorScope
from core.modules.agents.support.main_agent_finder import MainAgentFinder
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.drivers.queries.hook_call_query import HookCallQuery
from suites.coding.modules.workers.commands.prompt_idle_main_agent.prompt_idle_main_agent import PromptIdleMainAgent
from suites.coding.modules.workers.support.available_work import AvailableWork
from suites.coding.modules.workers.support.coding_main_options import CodingMainOptions
from suites.coding.support.coding_nudges import FREE_WORKER_PLACE, TASK_ASSIGNMENT

WAKE_SOURCE = "coding.keep-going"


class PromptIdleMainAgentHandler(Handler[PromptIdleMainAgent, None]):
    """Wakes the idle main agent while keep going is on and work is left for it: the task it is handed, or the
    open tasks a free worker place can take. It is told once for each such state, so an agent that chose to
    leave the work is not woken again until the work changes."""

    command = PromptIdleMainAgent
    disabled_scopes = [ActorScope]

    def __init__(self, queries: Queries, options: CodingMainOptions, work: AvailableWork, hook_calls: HookCallQuery, nudger: Nudger) -> None:
        self.queries, self.options, self.work, self.hook_calls, self.nudger = queries, options, work, hook_calls, nudger

    def handle(self, command: PromptIdleMainAgent, context: Context) -> None:
        if not self.options.options().continues_work:
            return
        for agent in MainAgentFinder.rows(self.queries):
            if not self.hook_calls.is_idle(agent.id, context.timestamp):
                continue
            nudge = self.waking_nudge(agent.id)
            if nudge is None or self.was_informed(agent.id, nudge):
                continue
            self.nudger.send_nudge(agent.id, nudge, WAKE_SOURCE, context, wakes_agent=True)

    def waking_nudge(self, agent_id: int) -> Nudge | None:
        available = self.work.answer(agent_id)
        if available.assigned_task is not None:
            return TASK_ASSIGNMENT.nudge(task=available.assigned_task.id)
        if available.delegatable:
            return FREE_WORKER_PLACE.nudge(count=available.free_places, tasks=", ".join(str(task_id) for task_id in available.delegatable))
        return None

    def was_informed(self, agent_id: int, nudge: Nudge) -> bool:
        last = self.queries.query(AgentLine).filter(session_agent_id=agent_id, source=WAKE_SOURCE).newest().first()
        return last is not None and last.text == nudge.text
