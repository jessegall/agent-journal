from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.command.bus import Bus
from engine.command.context import Context
from engine.command.handler import Handler
from engine.driver.nudge import Nudge
from engine.query.queries import Queries
from engine.errors.refusal import Refusal
from engine.scope.actor_scope import ActorScope
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.drivers.support.main_agent_line import MainAgentLine
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.drivers.models.enums.agent_line_state import AgentLineState
from engine.query.conditions.is_null import IsNull
from engine.query.conditions.minimum import Minimum
from core.modules.helpers.commands.send_helper.send_helper import SendHelper
from core.modules.helpers.commands.start_helper.start_helper import StartHelper
from suites.coding.modules.workers.support.merger_nudges import MERGER_JOB, MERGER_PROFILE, MERGER_SOURCE
from suites.coding.modules.workers.support.merger_work import MergerWork
from suites.coding.modules.workers.commands.start_merger.start_merger import StartMerger


class StartMergerHandler(Handler[StartMerger, None]):
    """Gives the merger the job: a new one when none is kept, or the kept one, which is sent the job when it
    ended and a steering line when it runs. It retires no agent: a kept merger whose program or model differs
    from its profile keeps its number and memories. With none able to start, the main agent gets the
    fallback line."""

    command = StartMerger
    disabled_scopes = [ActorScope]

    def __init__(self, queries: Queries, bus: Bus, agents: AgentRows, main_line: MainAgentLine, work: MergerWork) -> None:
        self.queries, self.bus, self.agents, self.main_line, self.work = queries, bus, agents, main_line, work

    def handle(self, command: StartMerger, context: Context) -> None:
        if not self.work.waits():
            return
        main_agent = self.agents.main_agent()
        try:
            if main_agent is None:
                raise Refusal("no main agent runs")
            self.assign_job(Actor(main_agent.id, ActorType.AGENT), context)
        except Exception as failure:
            fallback = command.fallback_line.text if isinstance(command.fallback_line, Nudge) else command.fallback_line
            reason = failure.reason if isinstance(failure, Refusal) else f"an unexpected fault, {type(failure).__name__}: {failure}"
            text = f"{fallback} (the merger did not start: {reason})"
            existing = self.queries.query(AgentLine).filter(source=MERGER_SOURCE, state=AgentLineState.WAITING, text=text).first()
            if existing is not None or self.is_repeat(command, text):
                return
            self.main_line.send(text, MERGER_SOURCE, context)

    def is_repeat(self, command: StartMerger, text: str) -> bool:
        if command.started_at is None:
            return False
        return self.queries.query(AgentLine).filter(source=MERGER_SOURCE, text=text).matching(Minimum("created_at", command.started_at.text)).first() is not None

    def assign_job(self, actor: Actor, context: Context) -> None:
        kept = self.queries.query(Agent).filter(profile=MERGER_PROFILE).matching(IsNull("retired_at")).newest().first()
        if kept is None:
            self.bus.run(StartHelper(MERGER_PROFILE, MERGER_JOB), actor, environment_id=context.environment_id)
            return
        self.bus.run(SendHelper(kept.id, MERGER_JOB, steer=kept.ended_at is None), actor, environment_id=context.environment_id)
