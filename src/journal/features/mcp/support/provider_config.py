import json
from pathlib import Path

from journal.config import Config
from journal.repositories.mcp_servers import McpServers


class ProviderConfig:
    """The project's MCP servers written where each agent program reads them: Claude Code's .mcp.json and Codex's .codex/config.toml, both in the project, keys referred to by variable."""

    def __init__(self, config: Config, servers: McpServers) -> None:
        self.config, self.servers = config, servers

    def write(self) -> list[Path]:
        servers = self.servers.all()
        claude = self.config.root / ".mcp.json"
        stored = json.loads(claude.read_text()) if claude.is_file() else {}
        stored["mcpServers"] = {s.name: s.shape() for s in servers}
        claude.write_text(json.dumps(stored, indent=2) + "\n")
        codex = self.config.root / ".codex" / "config.toml"
        codex.parent.mkdir(exist_ok=True)
        codex.write_text(self.toml(servers))
        return [claude, codex]

    @staticmethod
    def toml(servers) -> str:
        lines = ["# Written by the journal: the project's MCP servers. Edit them on the viewer's MCP page.", ""]
        for s in servers:
            lines.append(f"[mcp_servers.{s.name}]")
            if s.transport == "stdio":
                lines.append(f'command = "{s.command}"')
                lines.append("args = [" + ", ".join(f'"{item}"' for item in s.args) + "]")
                if s.needs_key:
                    lines.append(f'env = {{ {s.key_var} = "${{{s.key_var}}}" }}')
            else:
                lines.append(f'url = "{s.url}"')
                if s.needs_key:
                    lines.append(f'bearer_token_env_var = "{s.key_var}"')
            lines.append("")
        return "\n".join(lines)
