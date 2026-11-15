from engine.ticker.tick_handler import TickHandler
from core.modules.approvals.ticks.recover_approvals_tick import RecoverApprovalsTick
from engine.ticker.tick_interval import TickInterval


class RecoverApprovalsTickHandler(TickHandler):
    """The tick handler of RecoverApprovalsTick."""

    interval = TickInterval(seconds=30)
    handler = RecoverApprovalsTick()
    name = "recover approvals"
    starts_immediately = True
