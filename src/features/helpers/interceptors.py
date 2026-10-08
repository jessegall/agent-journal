import re
from pathlib import Path

from controllers.types import Agents, Environments
from engine.gates import DISPATCHING, Runs
from engine.reach import Reach
from features.helpers.controller import Helpers
from features.helpers.resource import held_by_helper
from features.helpers.reuse import kept, named_paths, refusal
from features.parts import ActionInterceptor, AgentContext, Canceler, Context, ToolInterceptor
from engine.record import Record
from resources.base import AGENT, SYSTEM, Ref
from resources.types import HELPER

FILES_KEPT = 50
TEST_RUN = re.compile(r"(?:^|[\s;&|])(?:(?:python3?\s+-m\s+)?pytest|vitest|npm\s+(?:run\s+)?test|node\s+\S*browser/\S+\.mjs|journal\s+(?:--\S+\s+\S+\s+)*check\s+(?:run|touched|gate))\b")


def runs_tests(shell: str) -> bool:
    return bool(TEST_RUN.search(shell))


def may_run_tests(record) -> bool:
    place = Environments(record, actor=SYSTEM).rows.by_title(record.env)
    return bool(place and place.helping and Helpers(Record(record.root, place.launched_from), actor=SYSTEM).load(place.owned_by(HELPER)).whole_suite)


def relative(project: Path, path: str) -> str:
    return Path(path).relative_to(project).as_posix() if Path(path).is_relative_to(project) else path


def at_work(record, helper: Ref) -> bool:
    helpers = Helpers(record, actor=SYSTEM)
    return helpers.rows.exists(helper.n) and not helpers.load(helper.n).completed


def keep_with_its_helper(controller, n: int) -> None:
    row = controller.load(n)
    if controller.actor != AGENT or not held_by_helper(row):
        return
    helper = Ref.parse(row.assigned)
    if not at_work(controller.record, helper):
        return
    controller._refuse(f"todo {n} is handed to {helper.spoken}: only it marks it done, and taking its work closes it; "
                       f"to close, strike or reassign it yourself, journal helper stop {helper.n} gives it back first; "
                       f"journal helper say <helper> \"<text>\" --todos {n} moves it to another helper")


class HandedRowsCloseOnlyThroughTheirHelper(ActionInterceptor):
    def intercept(self, feature_context: Context, controller, n: int, **args) -> None:
        keep_with_its_helper(controller, n)


class HandedRowsStayAssigned(ActionInterceptor):
    def intercept(self, feature_context: Context, controller, n: int, **args) -> None:
        if {"assigned", "pending"} & args.keys():
            keep_with_its_helper(controller, n)


class KeepSubagentFiles(ToolInterceptor):
    reach = Reach.SUBAGENTS
    runs = Runs.ASYNC

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
        return refusal(census, context.settings, dispatch.kind or "subagent",
                       named_paths(f"{dispatch.description}\n{dispatch.prompt}"))


class RefuseTestRunsToHelpers(ToolInterceptor):
    reach = Reach.BOTH
    runs = Runs.SYNC

    def intercept(self, context: AgentContext, call) -> str:
        place = Environments(context.record, actor=SYSTEM).rows.by_title(context.record.env)
        shell = call.shell_command
        if not shell or not (context.agent.row.subagent or (place and place.helping)) or not runs_tests(shell) or may_run_tests(context.record):
            return ""
        return ("Helpers and subagents write tests but never run them: write the test that proves your change, commit, and name it in your report so the agent that dispatched you runs it. "
                "That agent can allow your runs with journal helper allow_suite.")
