import json
from argparse import Namespace
from datetime import datetime, timezone

from journal.console.command import Command
from journal.console.where import Where
from journal.repositories.agents import Agents
from journal.repositories.environments import Environments


class EnvironmentCommand(Command):
    noun = "environment"

    def __init__(self, environments: Environments, agents: Agents) -> None:
        self.environments, self.agents = environments, agents

    def arguments(self, verbs) -> None:
        self.verb(verbs, "list", "every environment and when it was last used")
        self.verb(verbs, "json", "the same, for the boot menu")
        self.verb(verbs, "create", "a new line of work").add_argument("name")

    def rows(self) -> list[dict]:
        rows = []
        for environment in self.environments.all() or [self.environments.named("main")]:
            agents = self.agents.in_(environment.id)
            last = agents[-1] if agents else None
            rows.append({"name": environment.name, "last_session": last.session if last and last.state != "ended" else (last.session if last else ""),
                         "last_used": self.ago(last.updated_at) if last else ""})
        return rows

    def list(self, args: Namespace, where: Where) -> int:
        for row in self.rows():
            print(f"{row['name']:<20} {row['last_used']}")
        return 0

    def json(self, args: Namespace, where: Where) -> int:
        print(json.dumps(self.rows()))
        return 0

    def create(self, args: Namespace, where: Where) -> int:
        environment = self.environments.named(args.name)
        print(f"environment {environment.id}: {environment.name}")
        return 0

    @staticmethod
    def ago(at: datetime) -> str:
        seconds = (datetime.now(timezone.utc) - at).total_seconds()
        for unit, span in (("day", 86400), ("hour", 3600), ("minute", 60)):
            if seconds >= span:
                n = int(seconds // span)
                return f"{n} {unit}{'s' if n != 1 else ''} ago"
        return "just now"
