from features.hosting.apps import app_here
from features.organization.agents import start_role_agent
from features.organization.delegation import WAITS_FOR, brief, global_ahead, missing, queued_behind
from engine.organization import organization
from framework.parts import Command, Context
from serving import SERVED, Processes


class ShowOrganization(Command):
    name = "organization"

    def run(self, context: Context, tickets):
        shaped = organization(context.record.root.parent).shaped()
        working = tickets._role_work()
        for domain in shaped["domains"]:
            domain["working"] = [{"role": role["name"], "role_title": role["title"] or role["name"], **ticket}
                                 for role in domain["roles"] for ticket in working.get((domain["name"], role["name"]), [])]
        return shaped


class Delegate(Command):
    name = "delegate"

    def run(self, context: Context, todos, task: str, domain: str, role: str = "", given: str = ""):
        found = organization(context.record.root.parent).domain(domain)
        chosen = found.role(role or found.lead)
        lacking = missing(chosen.inputs, f"{task}\n{given}")
        if lacking:
            todos._refuse(f"{chosen.name} needs {', '.join(lacking)} named in the task or --given")
        ahead = queued_behind(todos, found, chosen)
        queued = global_ahead(context.record, found, chosen)
        row = todos.create(task, brief=given, domain=found.name, role=chosen.name)
        if ahead:
            todos.after(row.n, ahead.n)
        if queued:
            env, first = queued
            todos.update(row.n, **{WAITS_FOR: f"{env}:{first}"})
            todos.block(row.n, f"{chosen.label} runs once per journal: to-do {first} in {env} goes first")
        text = brief(found, chosen, row.n, task, given, app_here(context.record))
        started = "" if ahead or queued else start_role_agent(context.record, chosen, row.n, text, SERVED.given(Processes))
        if started:
            todos.update(row.n, role_environment=started)
            text = f"{chosen.label} runs as a full agent: it was started in environment {started}, in this worktree. Nothing to dispatch."
        return {"todo": row.n, "waits": ahead.n if ahead else 0, "brief": text, "out": text, "agent": started}
