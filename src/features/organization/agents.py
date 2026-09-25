from engine.record import Record
from engine.seats import terminal_of
from engine.sessions import Sessions
from engine.stop import ask_session
from features.organization.files import AGENT, PLAN, Role
from features.tickets.launch import PROVIDER, start_agent_in


def role_environment(env: str, role: Role, n: int) -> str:
    return f"{env}-{role.name}" if role.cardinality == PLAN else f"{env}-{role.name}-{n}"


def kickoff(env: str, role: Role, n: int, brief: str) -> str:
    return (f"{brief}\n\nYou are a full agent of your own, started for to-do {n} in environment {env}. Every journal command about "
            f"that to-do runs as journal --env {env} ..., and when it is done, report it with journal --env {env} todo report {n} "
            f"\"<what landed>\". You work in the same worktree as the ticket's own agent, so keep to the files your task needs."
            + (" You stay for the whole plan: the next task for your role comes to you here." if role.cardinality == PLAN else ""))


def start_role_agent(record, role: Role, n: int, brief: str) -> str:
    if role.runs != AGENT:
        return ""
    name = role_environment(record.env, role, n)
    if role.cardinality == PLAN and enter_into(record, name, kickoff(record.env, role, n, brief)):
        return name
    return start_agent_in(record, name, record.env, f"Where {role.title or role.name} works on to-do {n} of {record.env}",
                          f"todo:{n}", kickoff(record.env, role, n, brief))


def enter_into(record, name: str, text: str) -> bool:
    from providers import DRIVERS
    session = Sessions(record.root).holder(name)
    return bool(session) and DRIVERS[PROVIDER](Record(record.root, name), terminal_of(record.root, session)).enter(text)


def stop_role_agent(record, name: str) -> None:
    session = Sessions(record.root).holder(name)
    if session:
        ask_session(record.root, terminal_of(record.root, session))
