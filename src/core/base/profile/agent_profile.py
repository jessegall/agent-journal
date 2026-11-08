from dataclasses import dataclass, field
from collections.abc import Mapping, Sequence
from typing import Any
from core.base.access import Access
from core.base.provider.model_tier import ModelTier


@dataclass(frozen=True)
class AgentProfile:
    """Instructions and program settings for one type of agent, with its usage counts."""

    name: str
    description: str
    body: str
    agent_type: str = "helper"
    access: Access | None = None
    program: str = ""
    program_if_possible: bool = True
    fallback_programs: tuple[str, ...] = ()
    model: str = ""
    codex_model: str = ""
    tier: ModelTier | None = None
    independent: bool = False
    mcp_tools: tuple[str, ...] = ()
    writable_folders: tuple[str, ...] = ()
    module: str = ""
    changed: tuple[str, ...] = ()
    module_text_changed: bool = False
    module_body: str = ""
    path: str = ""
    source_digest: str = ""
    problem: str = ""
    notes: tuple[str, ...] = ()
    uses: int = 0
    last_used: int = 0
    title: str = ""
    reports_to_parent: bool = True
    messages_siblings: bool = False
    program_models: Mapping[str, str] = field(default_factory=dict)
    keeps_project_instructions: bool = False
    injections: Mapping[str, bool] = field(default_factory=dict)

    @property
    def display_title(self) -> str:
        return self.title or self.name

    def fallbacks_after(self, preferred: str, registered: Sequence[str]) -> tuple[str, ...]:
        """The programs a start tries after the preferred one cannot start: this profile's own list in its order, else every registered program."""
        return tuple(name for name in dict.fromkeys(self.fallback_programs or registered) if name != preferred)

    @property
    def is_builtin(self) -> bool:
        return bool(self.module)

    @classmethod
    def parsed(cls, fields: Mapping[str, Any]) -> "AgentProfile":
        access = Access(fields["access"]) if fields["access"] is not None else None
        tier = ModelTier.automatic(fields["tier"]) if fields.get("tier") is not None else None
        return cls(**{**fields, "access": access, "tier": tier, "mcp_tools": tuple(fields["mcp_tools"]), "fallback_programs": tuple(fields.get("fallback_programs", ())), "writable_folders": tuple(fields.get("writable_folders", ())), "changed": tuple(fields["changed"]), "notes": tuple(fields.get("notes", ()))})
