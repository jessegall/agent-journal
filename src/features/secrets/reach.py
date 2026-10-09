import re
from pathlib import Path

from engine.stored import read_json

GENERIC = {"key", "token", "api", "login", "password", "secret", "test", "prod", "the", "for", "new", "old", "account"}


def servers_reaching(project: Path, title: str) -> list[str]:
    """The MCP servers connected to this project or this user whose name or address names the service the title is about."""
    words = [word for word in re.findall(r"[a-z]{3,}", title.lower()) if word not in GENERIC]
    if not words:
        return []
    return [name for name, server in connected(project).items() if any(word in f"{name} {server.get('url', '')}".lower() for word in words)]


def connected(project: Path) -> dict[str, dict]:
    servers: dict[str, dict] = {}
    servers.update(read_json(project / ".mcp.json", dict, {}).get("mcpServers") or {})
    own = read_json(Path.home() / ".claude.json", dict, {})
    servers.update(own.get("mcpServers") or {})
    servers.update(((own.get("projects") or {}).get(str(project)) or {}).get("mcpServers") or {})
    return {name: server for name, server in servers.items() if isinstance(server, dict)}
