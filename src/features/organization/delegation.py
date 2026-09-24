from engine.record import Record
from features.organization.files import GLOBAL, WORKTREE, Domain, Role
from resources.base import SYSTEM

WAITS_FOR = "waits_for"


def missing(names: list, text: str) -> list:
    return [name for name in names if str(name).lower() not in text.lower()]


def queued_behind(todos, domain: Domain, role: Role):
    if role.cardinality != WORKTREE:
        return None
    return max((r for r in todos._standing() if r.data.get("domain") == domain.name and r.data.get("role") == role.name), key=lambda r: r.n, default=None)


def everywhere(root, domain: str, role: str) -> list[tuple[str, object]]:
    from controllers.types import Todos
    home = root / "environments"
    found = []
    for folder in sorted(home.iterdir()) if home.is_dir() else []:
        todos = Todos(Record(root, folder.name), actor=SYSTEM)
        found += [(folder.name, todos.load(row["n"])) for row in todos.summaries() if not row["completed"] and not row["deleted"]]
    return [(env, r) for env, r in found if r.data.get("domain") == domain and r.data.get("role") == role]


def global_ahead(record, domain: Domain, role: Role) -> tuple[str, int] | None:
    if role.cardinality != GLOBAL:
        return None
    open_rows = everywhere(record.root, domain.name, role.name)
    if not open_rows:
        return None
    env, row = max(open_rows, key=lambda found: found[1].created)
    return env, row.n


def next_in_line(record, domain: str, role: str, env: str, n: int) -> None:
    from controllers.types import Todos
    waiting = [(e, r) for e, r in everywhere(record.root, domain, role) if r.data.get(WAITS_FOR) == f"{env}:{n}"]
    for e, r in waiting:
        Todos(Record(record.root, e), actor=SYSTEM).unblock(r.n)


BROWSER = "browser"


def brief(domain: Domain, role: Role, n: int, task: str, given: str, app: str = "") -> str:
    parts = [f"Dispatch this with model {role.model}, as its own job." if role.model else "",f"You are {role.title or role.name} in {domain.title or domain.name}.", role.description,
             f"You answer for: {role.responsible}" if role.responsible else "", f"Not yours: {role.not_responsible}" if role.not_responsible else "",
             f"Skills to load: {', '.join(role.skills)}" if role.skills else "", f"Tools you may use: {', '.join(role.tools)}" if role.tools else "",
             f"The task, to-do {n}: {task}", given,
             f"Open the ticket's app at {app} with your browser tool to see and check what you change." if app and BROWSER in role.tools else "",
             f"Report with journal todo report {n} \"<what you did>\", covering: {', '.join(role.outputs)}" if role.outputs
             else f"Report with journal todo report {n} \"<what you did>\""]
    return "\n".join(part for part in parts if part)
