from core.base.actor import Actor
from core.base.command.bus import Bus
from core.base.container import Container
from core.modules.approvals.commands.recover_approvals.recover_approvals import RecoverApprovals


class RecoverApprovalsTick:
    def __call__(self, container: Container) -> bool:
        return container.get(Bus).run(RecoverApprovals(), Actor.core()) > 0
