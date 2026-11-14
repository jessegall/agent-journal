from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.event.logged_event import LoggedEvent
from engine.event.moved import Moved
from engine.listener.commit.commit_listener import CommitListener
from core.modules.processes.models.lifecycles.process_lifecycle import ProcessLifecycle
from core.modules.processes.models.process import Process
from suites.coding.modules.workers.commands.report_merge_hook.report_merge_hook import ReportMergeHook
from suites.coding.modules.workers.support.merge_hook_line import MergeHookLine


class MergeHookEndListener(CommitListener[Moved[Process]]):
    """A merge hook that did not end well is told to the main agent as the merge hook of the worker it ran for; its
    merge stands."""

    name = "workers.merge-hook-ends"
    moves = [ProcessLifecycle.fail, ProcessLifecycle.stop, ProcessLifecycle.orphan]

    def __init__(self, bus: Bus) -> None:
        self.bus = bus

    def handle(self, event: Moved[Process], logged: LoggedEvent) -> None:
        process = event.row
        if process.is_merge_hook and process.owner_agent_id is not None:
            self.bus.run(ReportMergeHook(process.owner_agent_id, MergeHookLine.hook(process.line)), Actor.core(), cause_id=logged.id, environment_id=process.environment_id)
