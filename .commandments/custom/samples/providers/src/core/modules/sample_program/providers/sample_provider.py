# @sin architecture_providers_provider_runs_a_program
import subprocess

# @sin architecture_providers_provider_decides_what_an_agent_may_do
from engine.driver.hook_reply import HookReply
# @righteous architecture_providers_provider_decides_what_an_agent_may_do
from engine.driver.hook_event import HookEvent


class SampleProvider:
    """A provider sample that answers a hook and runs a program itself."""

    name = "sample"

    def answer(self, event: HookEvent) -> HookReply:
        # @sin architecture_processes_program_started_outside_the_door
        subprocess.run(["sample"], check=False, timeout=5)
        return HookReply.allowed()
