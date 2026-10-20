from journal.features.chart.support.assumptions import Assumptions
from journal.features.chart.support.checks import Checks
from journal.features.chart.support.context import Context


class AssumedChecks(Checks):
    """The checks with a trial's assumptions laid over the live rows: the counts, the times and the unread messages as assumed, everything else live."""

    def __init__(self, checks: Checks, assumptions: Assumptions, ledger: dict | None = None) -> None:
        vars(self).update(vars(checks))
        self.assumptions, self.ledger = assumptions, {} if ledger is None else ledger

    def count_of(self, ctx: Context, name: str) -> int:
        """The count as the dry walk left it: assumed when given, set or added to by the dry count nodes before this check."""
        base = self.assumptions.counts[name] if name in self.assumptions.counts else super().count_of(ctx, name)
        kind, value = self.ledger.get(ctx.value(name), ("add", 0))
        return value if kind == "set" else base + value

    def seconds_since(self, ctx: Context, name: str) -> int | None:
        """The time as assumed: by its name when given, else every time as long ago as the quiet given, else live."""
        if name in self.assumptions.since:
            return self.assumptions.since[name]
        return int(self.assumptions.quiet) if self.assumptions.quiet is not None else super().seconds_since(ctx, name)

    def unread_messages(self, ctx: Context) -> bool:
        return self.assumptions.unread > 0 if self.assumptions.unread is not None else super().unread_messages(ctx)

    def unread_over(self, ctx: Context, n: int) -> bool:
        return self.assumptions.unread >= n if self.assumptions.unread is not None else super().unread_over(ctx, n)
