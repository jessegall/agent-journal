from engine.events.agents import AgentReported
from engine.events.engine import CommandRan
from engine.ran import SHELL, STEP
from engine.git import checkout_of
from features.parts import ANY_BUT_PRE_TOOL_USE, AgentContext, Handler
from controllers.types import Agents
from features.git_actions.actions import calls


class MarkBranchSwitches(Handler):
    hooks = ANY_BUT_PRE_TOOL_USE
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
        context.journal.get(Agents).card(context.agent.row.n, label=label[:1].upper() + label[1:], icon="branch", tone="commit")


class MarkGitActions(Handler):
    def handle(self, context: AgentContext, event: CommandRan) -> None:
        if event.tool not in (SHELL, STEP) or event.stepped:
            return
        for call in calls(event.command, event.output, context.working_folder):
            label = call.mark()
            if label:
                context.journal.get(Agents).card(context.agent.row.n, label=label, icon="branch", tone="commit")
