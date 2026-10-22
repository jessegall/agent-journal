from pathlib import Path

from journal.config import Config
from journal.providers.providers import Providers
from journal.repositories.mcp_servers import McpServers


class ProviderConfig:
    """The project's MCP servers written where each agent program reads them, in the project, by its provider, keys referred to by variable."""

    def __init__(self, config: Config, servers: McpServers, providers: Providers) -> None:
        self.config, self.servers, self.providers = config, servers, providers

    def write(self) -> list[Path]:
        servers = self.servers.all()
        return [provider.write_mcp(self.config.root, servers) for provider in self.providers.all()]
