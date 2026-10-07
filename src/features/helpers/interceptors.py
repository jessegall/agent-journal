from pathlib import Path

from controllers.types import Agents
from engine.gates import DISPATCHING
from engine.reach import Reach
from features.helpers.controller import Helpers
from features.helpers.resource import held_by_helper
from features.helpers.reuse import kept, named_paths, refusal
from features.parts import ActionInterceptor, AgentContext, Canceler, Context, ToolInterceptor
from resources.base import AGENT, SYSTEM, Ref

FILES_KEPT = 50


def relative(project: Path, path: str) -> str:
    return Path(path).relative_to(project).as_posix() if Path(path).is_relative_to(project) else path


def keep_with_its_helper(controller, n: int) -> None:
    row = controller.load(n)
    if controller.actor != AGENT or not held_by_helper(row):
        return
    helper = Ref.parse(row.assigned)
    controller._refuse(f"todo {n} is handed to {helper.spoken}: only it marks it done, and taking its work closes it; "
                       f"to close, strike or reassign it yourself, journal helper stop {helper.n} gives it back first")


class HandedRowsCloseOnlyThroughTheirHelper(ActionInterceptor):
    def intercept(self, feature_context: Context, controller, n: int, **args) -> None:
        keep_with_its_helper(controller, n)


class HandedRowsStayAssigned(ActionInterceptor):
    def intercept(self, feature_context: Context, controller, n: int, **args) -> None:
        if {"assigned", "pending"} & args.keys():
            keep_with_its_helper(controller, n)


class KeepSubagentFiles(ToolInterceptor):
    reach = Reach.SUBAGENTS
    refuses = False

    def intercept(self, context: AgentContext, call) -> str:
        project, row = context.record.root.resolve().parent, context.agent.row
        new = [relative(project, path) for path in call.paths if path and relative(project, path) not in row.touched_files]
        if new:
            Agents(context.record, actor=SYSTEM).update(row.n, touched_files=[*row.touched_files, *new][-FILES_KEPT:])
        return ""


class OfferKeptAgentsFirst(Canceler):
    reach = Reach.MAIN
    event = DISPATCHING

    def cancel(self, context: AgentContext, dispatch) -> str:
        census = kept(context.record, Helpers(context.record, actor=SYSTEM).rows.standing())
        return refusal(census, int(context.settings.kept), dispatch.kind or "subagent", named_paths(f"{dispatch.description}\n{dispatch.prompt}"))
