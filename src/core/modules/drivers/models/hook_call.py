from dataclasses import dataclass

from core.base.model.model import Model
from core.modules.drivers.models.enums.hook_answer import HookAnswer


@dataclass(frozen=True, kw_only=True)
class HookCall(Model):
    """One hook an agent program sent, or one tick on which a rule spoke, with the driver that answered and its
    answer; the rules asked, the layers and any command dropped are in its metadata."""

    model_name = "hook_call"
    cli_name = "hook-call"

    agent_id: int
    environment_id: int
    creator_id: int
    hook: str
    firing: str
    tool: str = ""
    summary: str = ""
    writes_files: bool = False
    suite: str = ""
    driver: str = ""
    answer: HookAnswer = HookAnswer.ALLOWED
    refusal: str = ""
    lines: str = ""
