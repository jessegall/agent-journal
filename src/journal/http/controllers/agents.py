import time

from journal.config import Config
from journal.features.pausing.agent_pause import AgentPause
from journal.features.sequences.running import Running
from journal.features.shell.commands.shell_command import RAN
from journal.http.agents.agent_activity import AgentActivity
from journal.http.agents.terminal_line import TerminalLine
from journal.http.controllers.controller import Controller
from journal.http.request import Request
from journal.http.response import Response
from journal.models.agent import Agent
from journal.models.entry import Entry
from journal.providers.providers import Providers
from journal.support.refused import Refused
from journal.repositories.agents import Agents
from journal.repositories.edits import Edits
from journal.repositories.entries import Entries
from journal.repositories.environments import Environments
from journal.support.scope import Scope
from journal.supervisor_link import SupervisorLink

EDITS_SHOWN = 50
LINES_SHOWN = 200


class AgentController(Controller[Agent]):
    """The environment's agents with what each is doing; what the user types or picks for the live one goes to its terminal, and the files it changed and the commands it ran are read from here."""

    def __init__(self, agents: Agents, activity: AgentActivity, supervisor: SupervisorLink, entries: Entries, edits: Edits, scope: Scope, environments: Environments,
                 providers: Providers, running: Running, config: Config, pausing: AgentPause) -> None:
        self.repository, self.activity, self.supervisor, self.entries, self.file_edits, self.scope = agents, activity, supervisor, entries, edits, scope
        self.environments, self.providers, self.running, self.config, self.pausing = environments, providers, running, config, pausing

    def rows(self) -> list[Agent]:
        return self.repository.in_()

    def is_open(self, row: Agent) -> bool:
        return row.state != "ended"

    def shown_page(self, rows: list[Agent]) -> list[dict]:
        return self.activity.page(rows)

    def live(self, request: Request) -> Response:
        """The live agent of every environment, each with the environment it is in."""
        found = []
        for environment in self.environments.all():
            with self.scope.of(environment.id):
                agent = self.repository.live()
            if agent:
                found.append({"environment": environment.name, "agent": agent})
        return Response.json(found)

    def type(self, request: Request) -> Response:
        self.supervisor.type(self.scope.id, request.body.get("line", ""))
        return Response.json({})

    def shell(self, request: Request) -> Response:
        """A command typed in the terminal pane goes to the agent's own terminal, as the user would type it."""
        agent, command = self.repository.find(request.number("id")), request.body.get("command", "").strip()
        if command:
            self.supervisor.type_raw(agent.environment_id, command)
        return Response.json({"queued": bool(command)})

    def controls(self, request: Request) -> Response:
        """The pickers of the agent bar for a provider, the current choices marked."""
        provider = self.providers.named(request.params["provider"])
        current = {"model": request.query.get("model", ""), "effort": request.query.get("effort", "")}
        return Response.json({"groups": [{**group, "current": current.get(group["key"], "")} for group in provider.controls["groups"]], "note": provider.controls["note"]})

    def control(self, request: Request) -> Response:
        """A pick in the agent bar is the provider's own command, typed into the agent as the user would."""
        agent = self.repository.find(request.number("id"))
        provider = self.providers.named(agent.provider or "claude")
        action, value = request.body.get("action", ""), request.body.get("value", "")
        choice = next((c for g in provider.controls["groups"] if g["key"] == action for c in g["choices"] if c["value"] == value), None)
        if choice is None:
            raise Refused(f"{action} {value} is not a choice the agent bar offers")
        self.supervisor.choose(agent.environment_id, choice["command"])
        return Response.json({"queued": True})

    def edits(self, request: Request) -> Response:
        """The files the agent wrote or edited, newest last, with the lines each change added and removed."""
        agent = self.repository.find(request.number("id"))
        return Response.json({"cursor": time.time(), "edits": self.file_edits.of_agent(agent.session, request.queried("since"))[-EDITS_SHOWN:]})

    def edited_file(self, request: Request) -> Response:
        path = request.query.get("path", "")
        file = (self.config.root / path).resolve()
        if not str(file).startswith(str(self.config.root.resolve())) or not file.is_file():
            return Response.not_found(path)
        return Response.json({"path": path, "text": file.read_text(errors="replace")[:200000]})

    def terminal(self, request: Request) -> Response:
        """The shell commands the agent ran, part by part, with what each printed and how long it took."""
        agent = self.repository.find(request.number("id"))
        after = request.queried("after")
        ran = [e for e in reversed(self.entries.of_kind(RAN, 400)) if e.actor and e.actor.id == agent.session and e.data["at"] > after]
        return Response.json([self.line(agent.id, e) for e in ran][-LINES_SHOWN:])

    @staticmethod
    def line(agent_id: int, entry: Entry) -> TerminalLine:
        part = entry.data["part"]
        return TerminalLine(agent_id=agent_id, at=entry.data["at"], tool="Journal" if part.split(" ")[0].endswith("journal") else "Bash", command=part,
                            output=entry.data["output"], seconds=entry.data["seconds"], status=entry.data["status"], stepped=False, level="everything")

    def pause(self, request: Request) -> Response:
        return Response.json(self.shown(self.pausing.pause(self.repository.find(request.number("id")))))

    def resume(self, request: Request) -> Response:
        return Response.json(self.shown(self.pausing.resume(self.repository.find(request.number("id")))))

    def skip_step(self, request: Request) -> Response:
        agent = self.running_agent(request.number("id"))
        self.told(agent, self.running.skip(agent.session, agent.environment_id))
        return Response.json(self.shown(self.repository.find(agent.id)))

    def end_sequence(self, request: Request) -> Response:
        agent = self.running_agent(request.number("id"))
        self.told(agent, self.running.end(agent.session, agent.environment_id))
        return Response.json(self.shown(self.repository.find(agent.id)))

    def running_agent(self, id: int) -> Agent:
        agent = self.repository.find(id)
        if self.running.in_hand(agent.session, agent.environment_id) is None:
            raise Refused(f"agent {id} runs no sequence")
        return agent

    def told(self, agent: Agent, line: str) -> None:
        if self.running.typed_to(agent.session, agent.environment_id):
            self.supervisor.type(agent.environment_id, line)
