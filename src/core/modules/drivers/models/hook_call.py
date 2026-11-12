from engine.model.prunable import Prunable
from engine.query.conditions.excluding import Excluding
from engine.query.conditions.is_null import IsNull
from engine.query.conditions.subquery_match import SubqueryMatch
from engine.query.select import Select
from collections.abc import Mapping
from dataclasses import dataclass

from engine.enums.hook_event_name import HookEventName
from engine.driver.foreign_run import ForeignRun
from engine.driver.hook_transcript import HookTranscript
from engine.model.environment_scoped import EnvironmentScoped
from engine.enums.event_form import EventForm
from engine.row.metadata import Metadata
from engine.types.type_guards import is_list, is_text_mapping
from engine.model.model import Model
from engine.module.driver_entries import DRIVERS_MODULE
from engine.types.type_guards import is_list, is_mapping
from engine.enums.hook_answer import HookAnswer


COMPACTION = "compact"
SESSION_START = "session_start"
PROGRAM_SESSION = "session"
PROMPT = "prompt"
SUMMARY_CHARACTERS = 200
DISPLAYED_TEXT = "displayed"
DISPLAYED_PART = "displayed_part"
DISPLAYED_MESSAGE_ID = "displayed_message_id"
MONITOR_DESCRIPTION = "monitor_description"
STOP_ALLOWED = "stop_allowed"
STOP_REFUSED = "stop_refused"
HOOK_CHANGE_NAMES: dict[str, str] = {HookEventName.COMPACT: COMPACTION, HookEventName.SESSION_START: SESSION_START, HookEventName.PROMPT: PROMPT}


@dataclass(frozen=True, kw_only=True)
class HookCall(Prunable, EnvironmentScoped, Model):
    """One hook an agent program sent, or one tick on which a rule spoke, with the driver that answered and
    its answer; the rules asked, the layers and any command dropped are in its metadata."""

    kept_rows = 50000

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

    def change_name(self, old_row: Model | None) -> str | None:
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
        rules = self.metadata.module_part(DRIVERS_MODULE).get("rules", [])
        return tuple(row for row in rules if is_text_mapping(row) and row.get("outcome") == "refused") if is_list(rules) else ()

    @property
    def terminal(self) -> str:
        return self.driver_text("terminal")

    @property
    def displayed_text(self) -> str:
        return self.driver_text(DISPLAYED_TEXT)

    @property
    def displayed_part(self) -> str:
        return self.driver_text(DISPLAYED_PART)

    @property
    def displayed_message_id(self) -> str:
        return self.driver_text(DISPLAYED_MESSAGE_ID)

    @property
    def ended_session(self) -> str:
        return self.driver_text("ended_session")

    @property
    def monitor_description(self) -> str:
        return self.driver_text(MONITOR_DESCRIPTION)

    @property
    def folder(self) -> str:
        return self.driver_text("folder")

    @property
    def program_session(self) -> str:
        return self.driver_text(PROGRAM_SESSION)

    def driver_text(self, key: str) -> str:
        value = self.metadata.module_part(DRIVERS_MODULE).get(key, "")
        return value if isinstance(value, str) else ""

    @property
    def is_interrupted(self) -> bool:
        return bool(self.metadata.module_part(DRIVERS_MODULE).get("interrupted"))

    @property
    def journal_commands(self) -> frozenset[str]:
        return frozenset(self.text_values("journal_commands"))

    @property
    def transcript(self) -> HookTranscript:
        return HookTranscript(self.driver_text("program"), self.firing, self.driver_text("transcript_path"))

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
        category = self.metadata.module_part(DRIVERS_MODULE).get("search")
        return category if isinstance(category, str) else ""

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

    @classmethod
    def prunable(cls, query, table):
        lines = Select("agent_lines").matching(Excluding(IsNull("hook_call_id"))).column("hook_call_id")
        return super().prunable(query, table).matching(SubqueryMatch("id", lines, negated=True))
