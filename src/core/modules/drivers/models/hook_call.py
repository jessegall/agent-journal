from dataclasses import dataclass

from core.base.driver.hook_event_name import HookEventName
from core.base.driver.foreign_run import ForeignRun
from core.base.model.model import Model
from core.base.module.driver_entries import DRIVERS_MODULE
from core.modules.drivers.models.enums.hook_answer import HookAnswer


@dataclass(frozen=True, kw_only=True)
class HookCall(Model):
    """One hook an agent program sent, or one tick on which a rule spoke, with the driver that answered and
    its answer; the rules asked, the layers and any command dropped are in its metadata."""

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
    lines_added: int = 0
    lines_removed: int = 0
    suite: str = ""
    driver: str = ""
    answer: HookAnswer = HookAnswer.ALLOWED
    refusal: str = ""
    lines: str = ""
    updated_input: str = "{}"

    @property
    def foreign_runs(self) -> tuple[ForeignRun, ...]:
        return ForeignRun.parsed_many(self.metadata.module_part(DRIVERS_MODULE).get("foreign", []))

    @property
    def terminal(self) -> str:
        return self.driver_text("terminal")

    @property
    def folder(self) -> str:
        return self.driver_text("folder")

    def driver_text(self, key: str) -> str:
        value = self.metadata.module_part(DRIVERS_MODULE).get(key, "")
        return value if isinstance(value, str) else ""

    @property
    def is_compaction(self) -> bool:
        return self.hook == HookEventName.COMPACT

    @property
    def is_session_start(self) -> bool:
        return self.hook == HookEventName.SESSION_START
