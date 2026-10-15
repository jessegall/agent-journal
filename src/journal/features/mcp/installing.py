from journal.features.mcp.health import Health
from journal.features.mcp.keys import Keys
from journal.features.mcp.provider_config import ProviderConfig
from journal.models.actor import Actor
from journal.models.mcp_server import McpServer
from journal.providers.providers import Providers
from journal.repositories.agents import Agents
from journal.repositories.mcp_servers import McpServers
from journal.supervisor_link import SupervisorLink


class Installing:
    """The one way a server is added, keyed, removed or checked: the row, the configuration the agents read, and a restart of the agents running, so it applies at once."""

    def __init__(self, servers: McpServers, config_files: ProviderConfig, keys: Keys, health: Health, agents: Agents, providers: Providers, supervisor: SupervisorLink) -> None:
        self.servers, self.config_files, self.keys, self.health = servers, config_files, keys, health
        self.agents, self.providers, self.supervisor = agents, providers, supervisor

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

    def checked(self, by: Actor) -> list[McpServer]:
        found = self.health.of_all()
        checked = []
        for server in self.servers.all():
            known = found.get(server.name) or found.get("*")
            state, words = (known.state, known.words) if known else ("needs_key" if server.key_var and not self.keys.has(server.key_var) else "installed", "")
            checked.append(self.servers.save(server.checked(state, words if state == "failed" else ""), by))
        return checked

    def applied(self) -> None:
        """The configuration written and every running agent restarted on its own conversation."""
        self.config_files.write()
        for agent in self.agents.all():
            if agent.state != "ended" and self.supervisor.inbox_of(agent.environment_id):
                self.supervisor.restart_agent(agent.environment_id, self.providers.named(agent.provider or "claude").resume(agent.session))
