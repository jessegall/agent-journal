from controllers.types import Environments, Features
from engine.record import Record
from engine.seats import terminal_of
from engine.sessions import Sessions
from engine.stop import ask_session
from features.organization.files import AGENT, Domain, Role
from features.permission_prompts.feature import prompted
from resources.base import SYSTEM

QUIET_FOR_ROLES = ("dev_faults",)
PROVIDER = "claude"


def role_environment(env: str, role: Role, n: int) -> str:
    return f"{env}-{role.name}-{n}"


def kickoff(env: str, role: Role, n: int, brief: str) -> str:
    return (f"{brief}\n\nYou are a full agent of your own, started for to-do {n} in environment {env}. Every journal command about "
            f"that to-do runs as journal --env {env} ..., and when it is done, report it with journal --env {env} todo report {n} "
            f"\"<what landed>\". You work in the same worktree as the ticket's own agent, so keep to the files your task needs.")


def start_role_agent(record, role: Role, n: int, brief: str) -> str:
    from engine.terminal import detached
    from providers import DRIVERS
    if role.runs != AGENT:
        return ""
    name = role_environment(record.env, role, n)
    environments = Environments(record, actor=SYSTEM)
    if not environments._titled(name):
        environments.create(name, abstract=f"Where {role.title or role.name} works on to-do {n} of {record.env}", owner=f"todo:{n}")
    place = Record(record.root, name)
    prompted(place)
    for feature in QUIET_FOR_ROLES:
        Features(place, actor=SYSTEM).switch(feature, False)
    driver = DRIVERS[PROVIDER]
    detached(record.root, record.root.parent, name, PROVIDER, driver.prompted(driver.within([*driver.AUTO_ARGS], record.env), kickoff(record.env, role, n, brief)))
    return name


def stop_role_agent(record, name: str) -> None:
    session = Sessions(record.root).holder(name)
    if session:
        ask_session(record.root, terminal_of(record.root, session))
