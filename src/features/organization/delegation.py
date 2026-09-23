from features.organization.files import WORKTREE, Domain, Role


def missing(names: list, text: str) -> list:
    return [name for name in names if str(name).lower() not in text.lower()]


def queued_behind(todos, domain: Domain, role: Role):
    if role.cardinality != WORKTREE:
        return None
    return max((r for r in todos._standing() if r.data.get("domain") == domain.name and r.data.get("role") == role.name), key=lambda r: r.n, default=None)


def brief(domain: Domain, role: Role, n: int, task: str, given: str) -> str:
    parts = [f"Dispatch this with model {role.model}, as its own job." if role.model else "",f"You are {role.title or role.name} in {domain.title or domain.name}.", role.description,
             f"You answer for: {role.responsible}" if role.responsible else "", f"Not yours: {role.not_responsible}" if role.not_responsible else "",
             f"Skills to load: {', '.join(role.skills)}" if role.skills else "", f"Tools you may use: {', '.join(role.tools)}" if role.tools else "",
             f"The task, to-do {n}: {task}", given,
             f"Report with journal todo report {n} \"<what you did>\", covering: {', '.join(role.outputs)}" if role.outputs
             else f"Report with journal todo report {n} \"<what you did>\""]
    return "\n".join(part for part in parts if part)
