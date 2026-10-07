from controllers.types import Todos
from engine.record import Record
from engine.organization import GLOBAL, WORKTREE, Domain, Role, organization
from resources.base import SYSTEM

WAITS_FOR = "waits_for"


def missing(names: list, text: str) -> list:
    return [name for name in names if str(name).lower() not in text.lower()]


def queued_behind(todos, domain: Domain, role: Role):
    if role.cardinality != WORKTREE:
        return None
    return max((r for r in todos.rows.standing() if r.data.get("domain") == domain.name and r.data.get("role") == role.name), key=lambda r: r.n, default=None)


def role_of(record, todo) -> Role | None:
    return organization(record.root.parent).domain(todo.data["domain"]).role(todo.data["role"]) if todo.data.get("role") else None


def everywhere(root, domain: str, role: str) -> list[tuple[str, object]]:
    found = []
    for record in Record.every(root):
        todos = Todos(record, actor=SYSTEM)
        found += [(record.env, todos.load(row["n"])) for row in todos.rows.standing_summaries()]
    return [(env, r) for env, r in found if r.data.get("domain") == domain and r.data.get("role") == role]


def global_ahead(record, domain: Domain, role: Role) -> tuple[str, int] | None:
    if role.cardinality != GLOBAL:
        return None
    open_rows = everywhere(record.root, domain.name, role.name)
    if not open_rows:
        return None
    env, row = max(open_rows, key=lambda found: found[1].created)
    return env, row.n


def next_in_line(record, domain: str, role: str, env: str, n: int) -> list[tuple[str, object]]:
    return [(e, r) for e, r in everywhere(record.root, domain, role) if r.data.get(WAITS_FOR) == f"{env}:{n}"]


BROWSER = "browser"


def guidance(domain: Domain, role: Role) -> list[str]:
    guides = [path for path in (role.guide, domain.guide) if path]
    skills = [*role.skill_files, *domain.skill_files]
    return [f"Read your instructions first: {', '.join(guides)}" if guides else "",
            f"Skills for your role and domain, read each before you use it: {', '.join(skills)}" if skills else ""]


def brief(domain: Domain, role: Role, n: int, task: str, given: str, app: str = "") -> str:
    parts = [f"Dispatch this with model {role.model}, as its own job." if role.model else "",f"You are {role.label} in {domain.label}.", role.description,
             f"You answer for: {role.responsible}" if role.responsible else "", f"Not yours: {role.not_responsible}" if role.not_responsible else "",
             f"Skills to load: {', '.join(role.skills)}" if role.skills else "", f"Tools you may use: {', '.join(role.tools)}" if role.tools else "",
             *guidance(domain, role),
             f"The task, to-do {n}: {task}", given,
             f"Open the ticket's app at {app} with your browser tool to see and check what you change." if app and BROWSER in role.tools else "",
             f"Report with journal todo report {n} \"<what you did>\", covering: {', '.join(role.outputs)}" if role.outputs
             else f"Report with journal todo report {n} \"<what you did>\""]
    return "\n".join(part for part in parts if part)
