from argparse import Namespace

from journal.console.command import Command
from journal.console.where import Where
from journal.features.mcp.catalogue import Catalogue
from journal.features.mcp.installing import Installing
from journal.features.mcp.keys import Keys
from journal.repositories.mcp_servers import McpServers


class McpCommand(Command):
    noun = "mcp"

    def __init__(self, servers: McpServers, catalogue: Catalogue, keys: Keys, installing: Installing) -> None:
        self.servers, self.catalogue, self.keys, self.installing = servers, catalogue, keys, installing

    def arguments(self, verbs) -> None:
        self.verb(verbs, "list", "the project's MCP servers and how each stands")
        self.verb(verbs, "suggested", "the servers worth adding")
        self.verb(verbs, "install", "add a suggested server by name, write the agents' configuration and restart them").add_argument("name")
        key = self.verb(verbs, "key", "the key a server signs in with; kept outside the project")
        key.add_argument("name")
        key.add_argument("value")
        self.verb(verbs, "remove", "take a server out and restart the agents").add_argument("name")
        self.verb(verbs, "check", "ask the agent program how each server stands")

    def list(self, args: Namespace, where: Where) -> int:
        for s in self.servers.all():
            print(f"{s.name:<12} {s.state:<11} {s.title}" + (f": {s.last_error}" if s.last_error else ""))
        return 0

    def suggested(self, args: Namespace, where: Where) -> int:
        for s in self.catalogue.all():
            print(f"{s.name:<12} {s.title}: {s.about}" + (f" (key: {s.key_var})" if s.key_var else " (signs in on its own)" if s.auth == "oauth" else ""))
        return 0

    def install(self, args: Namespace, where: Where) -> int:
        server = self.installing.add(self.catalogue.named(args.name).server(), where.actor)
        print(f"installed {server.name}" + (f": needs its key, journal mcp key {server.name} <value>" if server.state == "needs_key" else ""))
        return 0

    def key(self, args: Namespace, where: Where) -> int:
        server = self.installing.keyed(self.servers.named(args.name), args.value, where.actor)
        print(f"key kept for {server.name}, outside the project")
        return 0

    def remove(self, args: Namespace, where: Where) -> int:
        self.installing.remove(self.servers.named(args.name), where.actor)
        print(f"removed {args.name}")
        return 0

    def check(self, args: Namespace, where: Where) -> int:
        for s in self.installing.checked(where.actor):
            print(f"{s.name:<12} {s.state:<11}" + (f" {s.last_error}" if s.last_error else ""))
        return 0
