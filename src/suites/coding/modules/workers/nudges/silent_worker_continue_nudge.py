from suites.coding.modules.workers.nudges.silent_agent_continue_nudge import SilentAgentContinueNudge


class SilentWorkerContinueNudge(SilentAgentContinueNudge):
    """The nudge workers.continue_silent_worker: the line to a silent agent, for a worker, which it does not wake."""

    key = "workers.continue_silent_worker"
    wakes_agent = False
