from features.hosting.apps import app_here
from features.organization.delegation import WAITS_FOR, brief, global_ahead, missing, queued_behind
from features.organization.files import organization
from features.parts import ActionInterceptor, Command, Context


class ShowOrganization(Command):
    name = "organization"

    def run(self, context: Context, tickets):
        return organization(context.record.root.parent).shaped()


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
            todos.block(row.n, f"{chosen.title or chosen.name} runs once per journal: to-do {first} in {env} goes first")
        text = brief(found, chosen, row.n, task, given, app_here(context.record))
        return {"todo": row.n, "waits": ahead.n if ahead else 0, "brief": text, "out": text}


class ReportCoversOutputs(ActionInterceptor):
    def intercept(self, feature_context: Context, controller, **args):
        reported = args.get("reported")
        if controller.type != "todo" or not isinstance(reported, dict):
            return None
        row = controller.load(int(args["n"]))
        if not row.data.get("role"):
            return None
        role = organization(feature_context.record.root.parent).domain(row.data["domain"]).role(row.data["role"])
        lacking = missing(role.outputs, str(reported.get("how", "")))
        if lacking:
            controller._refuse(f"{role.name}'s report covers {', '.join(role.outputs)}; it does not mention {', '.join(lacking)}")
        return None
