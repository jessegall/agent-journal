from controllers.todos import WAITS_FOR  # noqa: F401  the commands name it here
from controllers.types import Todos
from engine.organization import GLOBAL, WORKTREE, Domain, Role, organization
from resources.base import SYSTEM


def missing(names: list, text: str) -> list:
    return [name for name in names if str(name).lower() not in text.lower()]


def queued_behind(todos, domain: Domain, role: Role):
    if role.cardinality != WORKTREE:
        return None
    return max((r for r in todos.rows.standing() if r.data.get("domain") == domain.name and r.data.get("role") == role.name), key=lambda r: r.creation_order(), default=None)


def global_ahead(record, domain: Domain, role: Role) -> tuple[str, int] | None:
    if role.cardinality != GLOBAL:
        return None
    open_rows = Todos(record, actor=SYSTEM).everywhere(domain.name, role.name)
    if not open_rows:
        return None
    env, row = max(open_rows, key=lambda found: found[1].created)
    return env, row.n


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
