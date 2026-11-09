from core.base.change.created import Created
from core.base.change.logged_event import LoggedEvent
from core.base.scope.actor_scope import ActorScope
from core.modules.agents.models.agent import AGENTS_TABLE, Agent
from core.modules.chat.listeners.mark_listener import MarkListener
from core.modules.helpers.models.helper_grant import HelperGrant
from suites.coding.modules.workers.models.enums.worker_mark_type import WorkerMarkType
from suites.coding.modules.workers.models.enums.worker_mark_variant import WorkerMarkVariant


class HelperGrantMarkListener(MarkListener[Created[HelperGrant]]):
    """Shows in the chat what a helper was granted."""

    name = "workers.helper-grant-mark"
    disabled_scopes = [ActorScope]
    module_name = "journal.suites.coding.workers"

    def handle(self, event: Created[HelperGrant], logged: LoggedEvent) -> None:
        grant = event.row
        helper = self.event_rows.required(Agent, grant.helper_id)
        name = helper.given_name or f"Helper {helper.id}"
        detail = f"Program: {grant.program}\nSubcommands: {grant.subcommands}\nArguments: {grant.arguments}"
        self.show(logged, WorkerMarkType.WORKER, WorkerMarkVariant.TEST_ALLOWED, f"{name} may run {grant.program}", None, AGENTS_TABLE, helper.id, detail=detail)
