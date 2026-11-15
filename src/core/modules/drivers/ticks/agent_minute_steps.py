from itertools import groupby

from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.container.container import Container
from engine.query.queries import Queries
from engine.scope.scopes import Scopes
from core.modules.agents.models.agent import Agent
from core.modules.drivers.commands.request_agent_step.request_agent_step import RequestAgentStep
from core.modules.drivers.models.agent_stack import AgentStack
from core.modules.drivers.support.agent_slices import AgentSlices
from core.modules.drivers.support.contribution_slices import WAITING_SLICE

MINUTE_STEP = "drivers.minute-step"
STACKS_REASON = "the minute step reaches every agent with a stack, one row each"


class AgentMinuteSteps:
    """The minute step, and the boot step as its first run (doc 1310 section 6.2): a step request for every agent
    with a stack that is not retired, running or not, once the waiting slice answers it, one write per
    environment, which the round serves. A step that changes nothing writes nothing more than its request's
    end."""

    def __call__(self, container: Container) -> None:
        queries, bus = container.get(Queries), container.get(Bus)
        stacked = [stack.session_agent_id for stack in queries.query(AgentStack).every_row(STACKS_REASON) if stack.has_frames]
        agents = sorted((agent for agent in queries.query(Agent).find_many(stacked) if agent.retired_at is None), key=lambda agent: agent.environment_id)
        for environment_id, environment_agents in groupby(agents, key=lambda agent: agent.environment_id):
            with container.get(Scopes).read_scope((), None, environment_id):
                answered = tuple(agent.id for agent in environment_agents if WAITING_SLICE in container.get(AgentSlices).active(agent))
            if answered:
                bus.run(RequestAgentStep(answered, MINUTE_STEP), Actor.core(), environment_id=environment_id)
