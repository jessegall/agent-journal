from argparse import Namespace

from core.base.caller.caller import Caller


class OverviewCommand:
    """A command that prints an overview an agent reads once in its context window: a second read of the same
    target is refused until the context is compacted or cleared."""

    def overview_target(self, arguments: Namespace) -> str:
        return ""

    def is_read_required(self, arguments: Namespace, caller: Caller) -> bool:
        return False
