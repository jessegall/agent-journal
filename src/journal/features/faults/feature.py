from journal.engine.nudge import Nudge
from journal.features.feature import Feature
from journal.support.option import Option
from journal.features.faults.commands.developer_command import DeveloperCommand
from journal.features.faults.jobs.developer_write import DeveloperWrite
from journal.features.faults.listeners.slow_job_notice import SlowJobNotice
from journal.features.faults.seeds.stale_test_run_files import StaleTestRunFiles


class Faults(Feature):
    name = "faults"
    title = "Slow requests"
    help = "A request slower than its budget is a fault: everything runs on one machine against one file, so a slow answer is a bug. Reporting is off unless switched on, as it is where the journal develops itself. Each is one mark in the chat per route, its worst time and how often, and the agent is told the first time and again once the set minutes have passed. It stays quiet while the journal starts or updates and while the machine is busier than it has cores."
    REPORT = Option("faults.report", "Report slow requests to the agent", "A request over its budget is marked in the chat and the agent is told to fix it; off, the Developer tab still counts every request's time", False, kind="switch")
    REQUEST = Option("faults.budget.request", "Budget for a request that reads", "Milliseconds a request that reads may take before it is reported; 0 reports none", 50, unit="ms")
    EDIT_BUDGET = Option("faults.budget.write", "Budget for a request that writes", "Milliseconds a request that writes may take before it is reported; 0 reports none", 50, unit="ms")
    REPEAT = Option("faults.repeat_minutes", "Tell a slow request again after", "Minutes since the agent was last told of a slow request before it is told again the next time that request is slow; 0 tells it once only", 15, unit="min")
    LOADS = Option("faults.count_loads", "Count the records each request reads", "Every record a request or a hook reads from the database is counted by its kind, shown with the newest requests and as totals since the last reset; off, nothing is counted", False, kind="switch")
    JOBS = Option("faults.jobs", "Tell the agent about slow jobs", "A background job whose tick runs longer than a second is always logged; on, the agent is told to fix it too", False, kind="switch")
    SLOW_REQUEST = Nudge(name, "slow_request_to_fix", "{{method}} {{route}} took {{ms}} ms, over its budget of {{budget}} ms: find what made it slow and fix it at its source", "a request over its budget is a fault of the journal's own")
    SLOW_JOB = Nudge(name, "slow_job_to_fix", "the background job {{job}} took {{seconds}} seconds for one tick", "every other job waited on it: find what made it slow and fix it at its source")
    options = (REPORT, REQUEST, EDIT_BUDGET, REPEAT, LOADS, JOBS)
    nudges = (SLOW_REQUEST, SLOW_JOB)
    listeners = (SlowJobNotice,)
    seeds = (StaleTestRunFiles,)
    jobs = (DeveloperWrite,)
    commands = (DeveloperCommand,)