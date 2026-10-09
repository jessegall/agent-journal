import re
from pathlib import Path

from providers import PROVIDERS

GENERIC = {"key", "token", "api", "login", "password", "secret", "test", "prod", "the", "for", "new", "old", "account"}


def servers_reaching(project: Path, title: str) -> list[str]:
    """The MCP servers any agent has connected whose name or address names the service the title is about."""
    words = [word for word in re.findall(r"[a-z]{3,}", title.lower()) if word not in GENERIC]
    connected = {name: url for provider in PROVIDERS.values() for name, url in provider().mcp_servers(project).items()}
    return [name for name, url in connected.items() if any(word in f"{name} {url}".lower() for word in words)]
