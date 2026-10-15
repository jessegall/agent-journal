from journal.features.mcp.health import Health
from journal.features.mcp.pending_restarts import PendingRestarts
from journal.features.mcp.keys import Keys
from journal.features.mcp.provider_config import ProviderConfig
from journal.engine.nudger import Nudger
from journal.models.actor import Actor
from journal.models.mcp_server import McpServer
from journal.providers.providers import Providers
from journal.repositories.agents import Agents
from journal.engine.turn import Turn
from journal.repositories.mcp_servers import McpServers
from journal.supervisor_link import SupervisorLink


class Installing:
    """The one way a server is added, keyed, removed or checked: the row, the configuration the agents read, and a restart of the agents running, so it applies at once."""

    def __init__(self, servers: McpServers, config_files: ProviderConfig, keys: Keys, health: Health, agents: Agents, providers: Providers, supervisor: SupervisorLink, turn: Turn, pending: PendingRestarts, nudger: Nudger) -> None:
        self.servers, self.config_files, self.keys, self.health = servers, config_files, keys, health
        self.agents, self.providers, self.supervisor, self.turn, self.pending, self.nudger = agents, providers, supervisor, turn, pending, nudger

    def add(self, server: McpServer, by: Actor) -> McpServer:
        saved = self.servers.save(server, by)
        self.applied()
        return saved

    def keyed(self, server: McpServer, value: str, by: Actor) -> McpServer:
        self.keys.set(server.key_var, value)
        saved = self.servers.save(server.checked("installed", ""), by)
        self.applied()
        return saved

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

    def checked(self, by: Actor) -> list[McpServer]:
        found = self.health.fresh()
        checked = []
        for server in self.servers.all():
            known = found.get(server.name) or found.get("*")
            state, words = (known.state, known.words) if known else ("needs_key" if server.key_var and not self.keys.has(server.key_var) else "installed", "")
            checked.append(self.servers.save(server.checked(state, words if state == "failed" else ""), by))
        return checked

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
        return [a for a in self.agents.all() if a.state != "ended" and self.supervisor.inbox_of(a.environment_id)]

    def applied(self) -> None:
        """The configuration written and every running agent restarted on its own conversation: at once when it sits idle, else the moment its turn ends."""
        self.config_files.write()
        for agent in self.running():
            resume = self.providers.named(agent.provider or "claude").resume(agent.session)
            if self.turn.over(agent):
                self.supervisor.restart_agent(agent.environment_id, resume)
            else:
                self.pending.add(agent.session, agent.environment_id, resume)
