from pathlib import Path

from journal.engine.nudge import Nudge
from journal.features.feature import Feature
from journal.support.option import Option


class Faults(Feature):
    name = "faults"
    title = "Slow requests"
    help = "Where the journal develops itself, a request slower than its budget is a fault: everything runs on one machine against one file, so a slow answer is a bug. Each is one mark in the chat per route, its worst time and how often, and the agent is told the first time. It stays quiet while the journal starts or updates and while the machine is busier than it has cores."
    REQUEST = Option("faults.budget.request", "Budget for a request that reads", "Milliseconds a request that reads may take before it is reported; 0 reports none", 50, unit="ms")
    WRITE = Option("faults.budget.write", "Budget for a request that writes", "Milliseconds a request that writes may take before it is reported; 0 reports none", 50, unit="ms")
    SLOW_REQUEST_TO_FIX = Nudge(name, "slow_request_to_fix", "{{method}} {{route}} took {{ms}} ms, over its budget of {{budget}} ms: find what made it slow and fix it at its source", "a request over its budget is a fault of the journal's own")
    options = (REQUEST, WRITE)
    nudges = (SLOW_REQUEST_TO_FIX,)

    @classmethod
    def applies_in(cls, root: Path) -> bool:
        """Only where the journal develops itself: the project holds the journal's own source."""
        return (root / "src" / "journal").is_dir()
