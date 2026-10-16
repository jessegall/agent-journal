from journal.engine.states_catalogue import StatesCatalogue
from journal.http.controllers.controller import Controller
from journal.http.request import Request
from journal.http.response import Response
from journal.models.agent import Agent
from journal.repositories.agents import Agents
from journal.repositories.entries import Entries
from journal.repositories.scope import Scope
from journal.supervisor_link import SupervisorLink


class AgentController(Controller[Agent]):
    """Agents with what their state allows, and a line typed into the live one."""

    def __init__(self, agents: Agents, states: StatesCatalogue, supervisor: SupervisorLink, entries: Entries, scope: Scope) -> None:
        self.repository, self.states, self.supervisor, self.entries, self.scope = agents, states, supervisor, entries, scope

    def index(self, request: Request) -> Response:
        return Response.json([self.described(agent) for agent in self.repository.page_in(self.limit(request), self.before(request))])

    def type(self, request: Request) -> Response:
        self.supervisor.type(self.scope.id, request.body.get("line", ""))
        return Response.json({})

    def described(self, agent: Agent) -> dict:
        state = self.states.named(agent.state, agent.data)
        last = self.entries.last_of_session(agent.session)
        activity = {"kind": last.kind, "tool": last.data.get("tool_name", ""), "at": last.created_at} if last else None
        return {**{f: getattr(agent, f) for f in ("id", "environment_id", "session", "provider", "state", "data", "context_mark", "updated_at")}, "allows": sorted(p.value for p in state.allows), "activity": activity}
