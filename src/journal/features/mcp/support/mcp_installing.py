from journal.features.mcp.support.health_report import HealthReport
from journal.features.mcp.support.health import Health
from journal.support.pending_restarts import PendingRestarts
from journal.support.keys import Keys
from journal.features.mcp.support.provider_config import ProviderConfig
from journal.support.actor import Actor
from journal.models.mcp_server import McpServer
from journal.support.rejection import Rejection
from journal.providers.providers import Providers
from journal.repositories.agents import Agents
from journal.features.mcp.support.restart_readiness import RestartReadiness
from journal.repositories.mcp_servers import McpServers
from journal.supervisor_link import SupervisorLink
from journal.models.agent import Agent


class McpInstalling:
    """The one way a server is added, keyed, removed or checked: the row, the configuration the agents read, and, for an added or removed server, a restart of each agent running once it is idle, so it applies as soon as it can."""

    def __init__(self, servers: McpServers, config_files: ProviderConfig, keys: Keys, health: Health, agents: Agents, providers: Providers, supervisor: SupervisorLink, idle: RestartReadiness, pending: PendingRestarts) -> None:
        self.servers, self.config_files, self.keys, self.health = servers, config_files, keys, health
        self.agents, self.providers, self.supervisor, self.idle, self.pending = agents, providers, supervisor, idle, pending

    def add(self, server: McpServer, actor: Actor) -> McpServer:
        saved = self.servers.save(server, actor)
        self.applied()
        self.health.recheck()
        return saved

    def keyed(self, server: McpServer, value: str, actor: Actor) -> McpServer:
        if not value.strip():
            raise Rejection(f"the key for {server.title} is blank")
        self.keys.set(server.key_var, value.strip())
        return self.servers.save(server.unchecked("installed"), actor)

    def remove(self, server: McpServer, actor: Actor) -> None:
        self.servers.delete(server, actor)
        if server.key_var:
            self.keys.drop(server.key_var)
        self.applied()
        self.health.recheck()

    def remove_known(self, name: str) -> bool:
        if not self.health.remove(name, self.provider()):
            return False
        self.applied()
        return True

    def add_custom(self, server: McpServer) -> None:
        self.health.add(server, self.provider())
        self.applied()

    def provider(self) -> str:
        agents = self.running()
        return agents[0].provider if agents else self.providers.default().name

    def unchecked_state(self, server: McpServer) -> str:
        return "needs_key" if server.needs_key and not self.keys.has(server.key_var) else "installed"

    def checked(self, actor: Actor) -> list[McpServer]:
        report = self.health.is_recent()
        return [self.servers.save(self.checked_one(server, report), actor) for server in self.servers.all()]

    def checked_one(self, server: McpServer, report: HealthReport) -> McpServer:
        if report.failure is not None:
            return server.checked("failed", report.failure)
        existing = report.servers.get(server.name)
        if existing is None:
            return server.unchecked(self.unchecked_state(server))
        return server.checked(existing.state, existing.text)

    def running(self) -> list[Agent]:
        newest = {agent.environment_id: agent for agent in sorted(self.agents.active_main_agents(), key=lambda item: item.update_time)}
        return [agent for environment_id, agent in newest.items() if self.supervisor.runs(environment_id)]

    def applied(self) -> None:
        self.config_files.write()
        for agent in self.running():
            resume = self.providers.lookup(agent.provider).resume(agent.session)
            if self.idle.is_idle(agent):
                self.supervisor.restart_agent(agent.environment_id, resume)
            else:
                self.pending.add(agent.session, agent.environment_id, resume)
