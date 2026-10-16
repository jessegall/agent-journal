from journal.features.chart.assumptions import Assumptions
from journal.features.chart.checks import Checks
from journal.features.chart.context import Context


class AssumedChecks(Checks):
    """The checks with a trial's assumptions laid over the live rows: the edits count and the unread messages as assumed, every other reading live."""

    def __init__(self, checks: Checks, assumptions: Assumptions) -> None:
        vars(self).update(vars(checks))
        self.assumptions = assumptions

    def count_of(self, ctx: Context, name: str) -> int:
        return self.assumptions.edits if name == "edits" and self.assumptions.edits is not None else super().count_of(ctx, name)

    def unread_messages(self, ctx: Context) -> bool:
        return self.assumptions.unread > 0 if self.assumptions.unread is not None else super().unread_messages(ctx)

    def unread_over(self, ctx: Context, n: int) -> bool:
        return self.assumptions.unread >= n if self.assumptions.unread is not None else super().unread_over(ctx, n)
