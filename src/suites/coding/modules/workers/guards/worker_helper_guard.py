from core.modules.helpers.types.helper import Helper
from engine.event.created import Created
from engine.command.context import Context
from engine.guard.guard import Guard
from core.modules.agents.models.agent import Agent
from engine.query.queries import Queries
from suites.coding.modules.workers.types.worker import Worker
from core.modules.drivers.support.command_check import CommandCheck
from core.modules.helpers.commands.start_helper.start_helper import StartHelper


class WorkerHelperGuard(Guard[Created[Agent]]):
    """A worker starts no read-only helper while workers may not use read-only helpers."""

    name = "workers.worker-starts-no-helper"

    def __init__(self, queries: Queries, start_check: CommandCheck) -> None:
        self.queries, self.start_check = queries, start_check

    # the helper's start asks the hook's policy, workers.worker-helper-allowed, at its entry point (doc 1310 section 10.9)
    def check(self, event: Created[Agent], context: Context) -> None:
        if event.row.role == Helper.key and self.start_check.answers(context) and self.queries.query(Agent).filter(id=context.actor.id, role=Worker.key).exists():
            self.start_check.admit(StartHelper, context)
