from journal.features.mcp.support.health_report import HealthReport
from journal.support.health import Health
from journal.support.pending_restarts import PendingRestarts
from journal.support.keys import Keys
from journal.features.mcp.support.provider_config import ProviderConfig
from journal.engine.nudger import Nudger
from journal.support.actor import Actor
from journal.models.mcp_server import McpServer
from journal.support.refused import Refused
from journal.providers.providers import Providers
from journal.repositories.agents import Agents
from journal.support.turn import Turn
from journal.repositories.mcp_servers import McpServers
from journal.supervisor_link import SupervisorLink


class McpInstalling:
    """The one way a server is added, keyed, removed or checked: the row, the configuration the agents read, and, for an added or removed server, a restart of the agents running, so it applies at once."""

    def __init__(self, servers: McpServers, config_files: ProviderConfig, keys: Keys, health: Health, agents: Agents, providers: Providers, supervisor: SupervisorLink, turn: Turn, pending: PendingRestarts, nudger: Nudger) -> None:
        self.servers, self.config_files, self.keys, self.health = servers, config_files, keys, health
        self.agents, self.providers, self.supervisor, self.turn, self.pending, self.nudger = agents, providers, supervisor, turn, pending, nudger

    def add(self, server: McpServer, by: Actor) -> McpServer:
        saved = self.servers.save(server, by)
        self.applied()
        return saved

    def keyed(self, server: McpServer, value: str, by: Actor) -> McpServer:
        """The key kept outside the project; nothing restarts, since a running agent keeps the environment it was launched with: the key applies from its next launch."""
        if not value.strip():
            raise Refused(f"the key for {server.title} is blank")
        self.keys.set(server.key_var, value.strip())
        return self.servers.save(server.unchecked("installed"), by)

    def remove(self, server: McpServer, by: Actor) -> None:
        self.servers.delete(server, by)
        if server.key_var:
            self.keys.forget(server.key_var)
        self.applied()

    def remove_known(self, name: str) -> bool:
        """A server set up in the program itself, taken out there; the agents restart as after any change."""
        if not self.health.remove(name):
            return False
        self.applied()
        return True

    def unchecked_state(self, server: McpServer) -> str:
        """How a server the program has not reported on stands: waiting for its key, or installed."""
        return "needs_key" if server.needs_key and not self.keys.has(server.key_var) else "installed"

    def checked(self, by: Actor) -> list[McpServer]:
        report = self.health.fresh()
        return [self.servers.save(self.checked_one(server, report), by) for server in self.servers.all()]

    def checked_one(self, server: McpServer, report: HealthReport) -> McpServer:
        """How the server stands by the program's check: failed with the check itself, as the program saw it, or, unseen, by whether its key is there."""
        if report.failure is not None:
            return server.checked("failed", report.failure)
        known = report.servers.get(server.name)
        if known is None:
            return server.unchecked(self.unchecked_state(server))
        return server.checked(known.state, known.words)

    def sign_in(self, server: McpServer) -> bool:
        """The first running agent is asked to sign in to the server through its own authenticate tool: the browser opens from its terminal."""
        from journal.features.mcp.feature import Mcp
        for agent in self.running():
            line = self.nudger.say(agent, Mcp.SIGN_IN.about(name=server.name, title=server.title))
            if line:
                self.supervisor.type(agent.environment_id, line)
                return True
        return False

    def running(self):
        return [a for a in self.agents.everywhere() if a.state != "ended" and self.supervisor.runs(a.environment_id)]

    def applied(self) -> None:
        """The configuration written and every running agent restarted on its own conversation: at once when it sits idle, else the moment its turn ends."""
        self.config_files.write()
        for agent in self.running():
            resume = self.providers.named(agent.provider or "claude").resume(agent.session)
            if self.turn.over(agent):
                self.supervisor.restart_agent(agent.environment_id, resume)
            else:
                self.pending.add(agent.session, agent.environment_id, resume)
