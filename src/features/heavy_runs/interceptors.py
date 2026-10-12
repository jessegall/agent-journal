"""Rule 4 enforced from the queue rather than from an orchestrator's memory: one heavy run at a time."""

import time

from controllers.types import Agents, Environments
from declaring.holds import Runs
from declaring.reach import Reach
from engine.record import Record
from features.heavy_runs.details import HeavyRunsDetails, WAITING
from features.heavy_runs.queue import HeavyRuns, Run
from features.helpers.interceptors import runs_tests
from framework.parts import AgentContext, ToolInterceptor
from resources.base import SYSTEM


def heavy_now(record) -> list[tuple[str, str]]:
    """Every heavy run going in the project now, as the environment it runs in and the command it runs, read from the agent rows rather than from anything anyone remembers."""
    return [(place.title, entry.get("command", ""))
            for place in Environments(record, actor=SYSTEM).rows.standing()
            for row in Agents(Record(record.root, place.title), actor=SYSTEM).rows.standing()
            for entry in row.runs
            if entry.get("running") and runs_tests(entry.get("command", ""))]


class HoldHeavyRunsToOneAtATime(ToolInterceptor):
    """A heavy run asked for while another is going joins the queue and is told where it stands, so the wait is the journal's to remember and not the agent's."""

    reach = Reach.BOTH
    runs = Runs.SYNC

    def intercept(self, context: AgentContext, call) -> str:
        shell = call.shell_command
        if not shell or not runs_tests(shell):
            return ""
        queue = HeavyRuns(context.record.root, float(HeavyRunsDetails.values(context.record).forgotten_after) * 60)
        ahead = [(where, command) for where, command in heavy_now(context.record) if where != context.record.env]
        if not ahead:
            queue.left(context.record.env)
            return ""
        at = queue.joined(Run(shell, context.record.env, at=time.time()))
        where, command = ahead[0]
        context.agent.whisper(WAITING, command=shell, ahead=command, where=where, place=f"number {queue.place_of(context.record.env)} of {len(at)}")
        return (f"{command} is running in {where}, and two heavy runs at once make both slower and neither time trustworthy. "
                f"You are number {queue.place_of(context.record.env)} of {len(at)} in the project's queue: start this again when that one has ended.")
