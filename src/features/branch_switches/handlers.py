from engine.events.agents import AgentReported
from engine.git import checkout_of
from features.parts import AgentContext, Handler


class MarkBranchSwitches(Handler):
    def handle(self, context: AgentContext, event: AgentReported) -> None:
        checkout = checkout_of(context.working_folder)
        if not checkout:
            return
        branch = checkout.branch
        before = context.state.get(checkout.name)
        if not branch or before == branch:
            return
        context.state.set(checkout.name, branch)
        if before is None and not checkout.linked:
            return
        label = f"{checkout.name} started on `{branch}`" if before is None else f"{checkout.name} switched from `{before}` to `{branch}`"
        context.journal.agents.card(context.agent.row.n, label=label[:1].upper() + label[1:], icon="branch", tone="commit")
