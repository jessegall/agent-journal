import time as timing

from journal.config import Config
from journal.features.pausing.agent_pause import AgentPause
from journal.features.sequences.support.run_tracker import RunTracker
from journal.http.agents.agent_activity import AgentActivity
from journal.http.agents.terminal_lines import TerminalLines
from journal.http.controllers.controller import Controller
from journal.http.support.request import Request
from journal.support.response import Response
from journal.models.agent import Agent
from journal.providers.providers import Providers
from journal.support.rejection import Rejection
from journal.repositories.agents import Agents
from journal.repositories.edits import Edits
from journal.repositories.environments import Environments
from journal.repositories.scope import Scope
from journal.supervisor_link import SupervisorLink

EDITS_SHOWN = 50


class AgentController(Controller[Agent]):
    """The environment's agents with what each is doing; what the user types or picks for the live one goes to its terminal, and the files it changed and the commands it ran are read from here."""

    def __init__(self, agents: Agents, activity: AgentActivity, supervisor: SupervisorLink, terminal_lines: TerminalLines, edits: Edits, scope: Scope, environments: Environments,
                 providers: Providers, active: RunTracker, config: Config, pausing: AgentPause) -> None:
        self.repository, self.activity, self.supervisor, self.terminal_lines, self.file_edits, self.scope = agents, activity, supervisor, terminal_lines, edits, scope
        self.environments, self.providers, self.running, self.config, self.pausing = environments, providers, active, config, pausing

    def rows(self) -> list[Agent]:
        return self.repository.scoped()

    def is_open(self, row: Agent) -> bool:
        return row.state != "ended"

    def shown_page(self, rows: list[Agent]) -> list[dict]:
        return self.activity.page(rows)

    def current(self, request: Request) -> Response:
        rows = []
        for environment in self.environments.all():
            with self.scope.environment(environment.id):
                agent = self.repository.current()
            if agent:
                rows.append({"environment": environment.name, "agent": agent})
        return Response.json(rows)

    def type(self, request: Request) -> Response:
        self.supervisor.type(self.scope.id, request.body.get("line", ""))
        return Response.json({})

    def shell(self, request: Request) -> Response:
        agent, command = self.repository.find(request.number("id")), request.body.get("command", "").strip()
        if command:
            self.supervisor.type_raw(agent.environment_id, command)
        return Response.json({"queued": bool(command)})

    def controls(self, request: Request) -> Response:
        provider = self.providers.lookup(request.params["provider"])
        current = {"model": request.query.get("model", ""), "effort": request.query.get("effort", "")}
        return Response.json({"groups": [{**group, "current": current.get(group["key"], "")} for group in provider.controls["groups"]], "note": provider.controls["note"]})

    def control(self, request: Request) -> Response:
        agent = self.repository.find(request.number("id"))
        provider = self.providers.lookup(agent.provider)
        action, value = request.body.get("action", ""), request.body.get("value", "")
        choice = next((c for g in provider.controls["groups"] if g["key"] == action for c in g["choices"] if c["value"] == value), None)
        if choice is None:
            raise Rejection(f"{action} {value} is not a choice the agent bar offers")
        self.supervisor.choose(agent.environment_id, choice["command"])
        return Response.json({"queued": True})

    def edits(self, request: Request) -> Response:
        agent = self.repository.find(request.number("id"))
        return Response.json({"cursor": timing.time(), "edits": self.file_edits.agent_edits(agent.session, request.queried("since"), EDITS_SHOWN)})

    def edited_file(self, request: Request) -> Response:
        path = request.query.get("path", "")
        file = (self.config.root / path).resolve()
        if not str(file).startswith(str(self.config.root.resolve())) or not file.is_file():
            return Response.absent(path)
        return Response.json({"path": path, "text": file.read_text(errors="replace")[:200000]})

    def terminal(self, request: Request) -> Response:
        return Response.json(self.terminal_lines.lines(self.repository.find(request.number("id")), request.queried("after")))

    def pause(self, request: Request) -> Response:
        return Response.json(self.shown(self.pausing.pause(self.repository.find(request.number("id")), request.actor)))

    def resume(self, request: Request) -> Response:
        return Response.json(self.shown(self.pausing.resume(self.repository.find(request.number("id")), request.actor)))

    def skip_step(self, request: Request) -> Response:
        agent = self.running_agent(request.number("id"))
        self.notice(agent, self.running.skip(agent.session, agent.environment_id))
        return Response.json(self.shown(self.repository.find(agent.id)))

    def end_sequence(self, request: Request) -> Response:
        agent = self.running_agent(request.number("id"))
        self.notice(agent, self.running.end(agent.session, agent.environment_id))
        return Response.json(self.shown(self.repository.find(agent.id)))

    def running_agent(self, id: int) -> Agent:
        agent = self.repository.find(id)
        if self.running.current(agent.session, agent.environment_id) is None:
            raise Rejection(f"agent {id} runs no sequence")
        return agent

    def notice(self, agent: Agent, line: str) -> None:
        if self.running.typed_agent(agent.session, agent.environment_id):
            self.supervisor.type(agent.environment_id, line)
