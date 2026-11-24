"""Prints each service of the installation that is not as it should be, one tab-separated line each: its name, service
for one that keeps running or step for one that runs once (restart: no), and the plain reason.

The compose configuration comes as JSON on standard input. Argument: a file of docker compose ps --all --format json,
which holds one container per line or one list of them.
"""

import json
import sys

services = json.load(sys.stdin)["services"]
listed = open(sys.argv[1]).read().strip()
containers = json.loads(listed) if listed.startswith("[") else [json.loads(line) for line in listed.splitlines() if line]
by_service = {container["Service"]: container for container in containers}


def reason_of(service, container):
    if container is None:
        return "was never started"
    if service.get("restart", "no") == "no":
        code = container.get("ExitCode", 0)
        return f"ended with exit code {code}" if container.get("State") == "exited" and code != 0 else None
    if container.get("State") != "running":
        return f"is {container.get('State')}"
    return "is unhealthy" if container.get("Health") == "unhealthy" else None


for name, service in services.items():
    reason = reason_of(service, by_service.get(name))
    if reason is not None:
        kind = "step" if service.get("restart", "no") == "no" else "service"
        print(f"{name}\t{kind}\t{reason}")
