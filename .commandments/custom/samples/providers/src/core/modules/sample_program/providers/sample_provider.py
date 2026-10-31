# @sin architecture_providers_ProvidersRunNothingDetector
import subprocess

# @sin architecture_providers_ProvidersDecideNothingDetector
from core.base.driver.hook_reply import HookReply
# @righteous architecture_providers_ProvidersDecideNothingDetector
from core.base.driver.hook_event import HookEvent


class SampleProvider:
    """A provider sample that answers a hook and runs a program itself."""

    name = "sample"

    def answer(self, event: HookEvent) -> HookReply:
        subprocess.run(["sample"], check=False, timeout=5)
        return HookReply.allowed()
