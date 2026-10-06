from pathlib import Path

from engine.services import claimed, local_url, service_spec
from engine.wording import fill
from features.hosting.apps import APP, hosted, service_of, worktree_of
from features.hosting.files import hosting_of


def ticket_apps(root: Path, taken: set) -> list:
    hosting = hosting_of(root.parent)
    if not hosting:
        return []
    apps = []
    for ticket in hosted(root):
        sid = service_of(ticket)
        port, blocked = claimed(root, sid, None, taken)
        where = worktree_of(root.parent, ticket)
        places = {"port": port, "worktree": str(where)}
        apps.append(service_spec(root, sid, plugin=ticket.work_environment, service=APP, run=fill(hosting.run, places), cwd=str(where),
                                 env={"PORT": str(port)}, path=hosting.ready, port=port, blocked=blocked, url=local_url(port)))
    return apps
