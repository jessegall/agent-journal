import os
import sys
from pathlib import Path

from journal.config import Config
from journal.features.registry import Registry
from journal.supervisor_link import SupervisorLink
from journal.support.supervisor_reply import SupervisorReply


class ServiceStart:
    """At boot, the journal asks the supervisor that hosts it to start every service the features declare; one already running is left as it is, so a restart starts nothing twice and an upgrade's new service starts with the journal it came in."""

    def __init__(self, registry: Registry, link: SupervisorLink, config: Config) -> None:
        self.registry, self.link, self.config = registry, link, config

    def run(self) -> list[SupervisorReply]:
        host = self.link.hosting()
        if host is None:
            self.disabled()
            return []
        package = Path(__file__).resolve().parents[3]
        environ = {**os.environ, "PYTHONPATH": str(package)}
        return [self.link.start(host, service.name, [sys.executable, "-m", service.module], self.config.root, environ, self.config.home / "runtime" / f"{service.name}.log") for service in self.registry.services()]

    def disabled(self) -> None:
        names = [service.name for service in self.registry.services()]
        if names:
            print(f"no supervisor hosts this journal, so these services are off: {', '.join(names)}", flush=True)
