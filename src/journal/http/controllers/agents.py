from journal.engine.states_catalogue import StatesCatalogue
from journal.http.controllers.controller import Controller
from journal.http.request import Request
from journal.http.response import Response
from journal.models.agent import Agent
from journal.repositories.agents import Agents
from journal.repositories.environments import Environments
from journal.supervisor_link import SupervisorLink


class AgentController(Controller[Agent]):
    """Agents with what their state allows, and a line typed into the live one."""

    def __init__(self, agents: Agents, environments: Environments, states: StatesCatalogue, supervisor: SupervisorLink) -> None:
        self.repository, self.environments, self.states, self.supervisor = agents, environments, states, supervisor

    def index(self, request: Request) -> Response:
        return Response.json([self.described(agent) for agent in self.repository.page_in(self.environment_id(request), self.limit(request), self.before(request))])

    def type(self, request: Request) -> Response:
        self.supervisor.type(request.body.get("line", ""))
        return Response.json({})

    def described(self, agent: Agent) -> dict:
        state = self.states.named(agent.state, agent.data)
        return {**{f: getattr(agent, f) for f in ("id", "environment_id", "session", "provider", "state", "data", "context_mark", "updated_at")}, "allows": sorted(p.value for p in state.allows)}
