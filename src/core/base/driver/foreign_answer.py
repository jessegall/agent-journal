import json
from collections.abc import Mapping
from dataclasses import dataclass, field
from typing import TYPE_CHECKING

from core.base.driver.foreign_run import ForeignRun
from core.base.driver.hook_event_name import HookEventName
from core.base.provider.refusal_style import RefusalStyle
from core.base.type_guards import is_mapping

if TYPE_CHECKING:
    from core.base.provider.provider import Provider


@dataclass(frozen=True)
class ForeignAnswer:
    name: str
    refusal: str = ""
    lines: tuple[str, ...] = ()
    updated_input: Mapping[str, object] = field(default_factory=dict)
    terminal: str = ""

    @classmethod
    def read(cls, provider: "Provider", event: HookEventName, run: ForeignRun) -> "ForeignAnswer":
        if run.timed_out:
            return cls(run.id, terminal=f"{run.id}: hook timed out")
        if run.exit_code == 2:
            return cls(run.id, refusal=run.stderr.strip() or "Hook refused without a reason")
        if run.exit_code != 0:
            return cls(run.id, terminal=f"{run.id}: hook exited with code {run.exit_code}: {run.stderr.strip()}")
        if not run.stdout.strip():
            return cls(run.id)
        try:
            data = json.loads(run.stdout)
        except json.JSONDecodeError:
            return cls(run.id, terminal=f"{run.id}: hook returned invalid JSON")
        if not is_mapping(data):
            return cls(run.id, terminal=f"{run.id}: hook answer must be an object")
        return cls.from_fields(provider, event, run.id, data)

    @classmethod
    def from_fields(cls, provider: "Provider", event: HookEventName, name: str, data: Mapping[str, object]) -> "ForeignAnswer":
        output = data.get("hookSpecificOutput", {})
        if not is_mapping(output):
            output = {}
        refusal = ""
        style = provider.refusals.get(event)
        if style is RefusalStyle.DENY and output.get("permissionDecision") == "deny":
            refusal = cls.text(output, "permissionDecisionReason") or "Hook refused without a reason"
        if style is RefusalStyle.BLOCK and data.get("decision") == "block":
            refusal = cls.text(data, "reason") or "Hook refused without a reason"
        terminal = cls.text(data, "systemMessage")
        if output.get("permissionDecision") == "ask":
            terminal = "\n".join(line for line in (terminal, f"{name}: hook asked for permission; the journal cannot ask") if line)
            return cls(name, terminal=terminal)
        updated_input = output.get("updatedInput", {})
        if not is_mapping(updated_input):
            updated_input = {}
        return cls(name, refusal, tuple(cls.text(output, "additionalContext").splitlines()), updated_input, terminal)

    @staticmethod
    def text(data: Mapping[str, object], key: str) -> str:
        value = data.get(key, "")
        return value if isinstance(value, str) else ""

    def reason(self) -> str:
        return f"{self.name}: {self.refusal}" if self.refusal else ""
