from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.container.container import Container
from core.modules.approvals.commands.recover_approvals.recover_approvals import RecoverApprovals


class RecoverApprovalsTick:
    def __call__(self, container: Container) -> bool:
        return container.get(Bus).run(RecoverApprovals(), Actor.core()) > 0
