from journal.engine.nudge import Nudge
from journal.features.feature import Feature
from journal.support.option import Option


class Faults(Feature):
    name = "faults"
    title = "Slow requests"
    help = "A request slower than its budget is a fault: everything runs on one machine against one file, so a slow answer is a bug. Reporting is off unless switched on, as it is where the journal develops itself. Each is one mark in the chat per route, its worst time and how often, and the agent is told the first time. It stays quiet while the journal starts or updates and while the machine is busier than it has cores."
    REPORT = Option("faults.report", "Report slow requests to the agent", "A request over its budget is marked in the chat and the agent is told to fix it; off, the Developer tab still counts every request's time", False, kind="switch")
    REQUEST = Option("faults.budget.request", "Budget for a request that reads", "Milliseconds a request that reads may take before it is reported; 0 reports none", 50, unit="ms")
    EDIT_BUDGET = Option("faults.budget.write", "Budget for a request that writes", "Milliseconds a request that writes may take before it is reported; 0 reports none", 50, unit="ms")
    SLOW_REQUEST = Nudge(name, "slow_request_to_fix", "{{method}} {{route}} took {{ms}} ms, over its budget of {{budget}} ms: find what made it slow and fix it at its source", "a request over its budget is a fault of the journal's own")
    options = (REPORT, REQUEST, EDIT_BUDGET)
    nudges = (SLOW_REQUEST,)