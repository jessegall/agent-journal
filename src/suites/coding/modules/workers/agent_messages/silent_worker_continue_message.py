from suites.coding.modules.workers.agent_messages.silent_agent_continue_message import SilentAgentContinueMessage


class SilentWorkerContinueMessage(SilentAgentContinueMessage):
    """The nudge workers.continue_silent_worker: the line to a silent agent, for a worker, which it does not wake."""

    key = "workers.continue_silent_worker"
    wakes_agent = False
