from journal.features.chart.assumptions import Assumptions
from journal.features.chart.checks import Checks
from journal.features.chart.context import Context


class AssumedChecks(Checks):
    """The checks with a trial's assumptions laid over the live rows: the edits since the log and the unread messages as assumed, every other reading live."""

    def __init__(self, checks: Checks, assumptions: Assumptions) -> None:
        vars(self).update(vars(checks))
        self.assumptions = assumptions

    def edits_before(self, ctx: Context) -> int:
        return self.assumptions.edits if self.assumptions.edits is not None else super().edits_before(ctx)

    def unread_messages(self, ctx: Context) -> bool:
        return self.assumptions.unread > 0 if self.assumptions.unread is not None else super().unread_messages(ctx)
