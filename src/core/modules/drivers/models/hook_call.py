from collections.abc import Mapping
from dataclasses import dataclass

from core.base.driver.hook_event_name import HookEventName
from core.base.driver.foreign_run import ForeignRun
from core.base.model.environment_scoped import EnvironmentScoped
from core.base.model.event_form import EventForm
from core.base.metadata import Metadata
from core.base.model.model import Model
from core.base.module.driver_entries import DRIVERS_MODULE
from core.base.type_guards import is_list, is_mapping
from core.modules.drivers.models.enums.hook_answer import HookAnswer


COMPACTION = "compact"
SESSION_START = "session_start"
PROMPT = "prompt"
SUMMARY_CHARACTERS = 200
DISPLAYED_TEXT = "displayed"
MONITOR_DESCRIPTION = "monitor_description"
STOP_ALLOWED = "stop_allowed"
STOP_REFUSED = "stop_refused"
HOOK_CHANGE_NAMES = {HookEventName.COMPACT: COMPACTION, HookEventName.SESSION_START: SESSION_START, HookEventName.PROMPT: PROMPT}


@dataclass(frozen=True, kw_only=True)
class HookCall(EnvironmentScoped, Model):
    """One hook an agent program sent, or one tick on which a rule spoke, with the driver that answered and
    its answer; the rules asked, the layers and any command dropped are in its metadata."""

    change_names = (COMPACTION, SESSION_START, PROMPT, STOP_ALLOWED, STOP_REFUSED)
    model_name = "hook_call"
    event_forms = tuple([EventForm.COMMIT])
    cli_name = "hook-call"

    session_agent_id: int
    environment_id: int = 0
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

    @staticmethod
    def summarize(text: str) -> str:
        return text.split("\n", 1)[0][:SUMMARY_CHARACTERS]

    def change_name(self, old_row: "HookCall | None") -> str | None:
        if old_row is not None:
            return None
        if self.hook == HookEventName.STOP:
            return STOP_ALLOWED if self.answer is HookAnswer.ALLOWED else STOP_REFUSED
        return HOOK_CHANGE_NAMES.get(self.hook)

    @property
    def foreign_runs(self) -> tuple[ForeignRun, ...]:
        return ForeignRun.parsed_many(self.metadata.module_part(DRIVERS_MODULE).get("foreign", []))

    @property
    def refused_rules(self) -> tuple[Mapping[str, object], ...]:
        return tuple(row for row in self.metadata.module_part(DRIVERS_MODULE).get("rules", []) if row.get("outcome") == "refused")

    @property
    def terminal(self) -> str:
        return self.driver_text("terminal")

    @property
    def displayed_text(self) -> str:
        return self.driver_text(DISPLAYED_TEXT)

    @property
    def ended_session(self) -> str:
        return self.driver_text("ended_session")

    @property
    def monitor_description(self) -> str:
        return self.driver_text(MONITOR_DESCRIPTION)

    @property
    def folder(self) -> str:
        return self.driver_text("folder")

    def driver_text(self, key: str) -> str:
        value = self.metadata.module_part(DRIVERS_MODULE).get(key, "")
        return value if isinstance(value, str) else ""

    @property
    def is_interrupted(self) -> bool:
        return bool(self.metadata.module_part(DRIVERS_MODULE).get("interrupted"))

    @property
    def is_compaction(self) -> bool:
        return self.hook == HookEventName.COMPACT

    @property
    def context_percent(self) -> int | None:
        percent = self.metadata.module_part(DRIVERS_MODULE).get("context_percent")
        return percent if isinstance(percent, int) else None

    def metadata_with_context_percent(self, percent: int) -> Metadata:
        return Metadata({**self.metadata.values, DRIVERS_MODULE: {**self.metadata.module_part(DRIVERS_MODULE), "context_percent": percent}})

    @property
    def search_category(self) -> str:
        kind = self.metadata.module_part(DRIVERS_MODULE).get("search")
        return kind if isinstance(kind, str) else ""

    @property
    def is_compaction_start(self) -> bool:
        return self.metadata.module_part(DRIVERS_MODULE).get("compaction_start") is True

    @property
    def is_manual_compaction(self) -> bool:
        return self.metadata.module_part(DRIVERS_MODULE).get("manual_compaction") is True

    @property
    def is_clear_start(self) -> bool:
        return self.metadata.module_part(DRIVERS_MODULE).get("clear_start") is True

    @property
    def is_session_start(self) -> bool:
        return self.hook == HookEventName.SESSION_START

    @property
    def is_resumed(self) -> bool:
        return bool(self.metadata.module_part(DRIVERS_MODULE).get("resumed"))

    @property
    def layers(self) -> tuple[str, ...]:
        return self.text_values("layers")

    @property
    def rule_outcomes(self) -> tuple[str, ...]:
        values = self.metadata.module_part(DRIVERS_MODULE).get("rules", [])
        return tuple(f"{row['rule']}: {row['outcome']}" for row in values if is_mapping(row)) if is_list(values) else ()

    @property
    def dropped_commands(self) -> tuple[str, ...]:
        return self.text_values("dropped")

    def text_values(self, key: str) -> tuple[str, ...]:
        values = self.metadata.module_part(DRIVERS_MODULE).get(key, [])
        return tuple(map(str, values)) if is_list(values) else ()
