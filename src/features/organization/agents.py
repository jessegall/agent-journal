from engine.organization import AGENT, PLAN, Role
from features.agent_sessions.launch import PROVIDER, start_agent_in, tell_in


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
    if role.cardinality == PLAN and tell_in(record, name, PROVIDER, kickoff(record.env, role, n, brief)):
        return name
    return start_agent_in(record, name, record.env, f"Where {role.label} works on to-do {n} of {record.env}",
                          f"todo:{n}", kickoff(record.env, role, n, brief))

