from dataclasses import dataclass, field, replace
from collections.abc import Mapping, Sequence
from typing import Any
from core.base.access import Access
from core.base.profile.model_tier import ModelTier


@dataclass(frozen=True)
class AgentProfile:
    """Instructions and program settings for one type of agent, with its usage counts."""

    name: str
    description: str = ""
    body: str = ""
    agent_type: str = "helper"
    access: Access | None = None
    program: str = ""
    preferred_program: bool = True
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
    has_parent_report: bool = True
    messages_siblings: bool = False
    program_models: Mapping[str, str] = field(default_factory=dict[str, str])
    uses_project_instructions: bool = False
    injections: Mapping[str, bool] = field(default_factory=dict[str, bool])
    skills: tuple[str, ...] = ()
    required_skills: tuple[str, ...] = ()

    @property
    def display_title(self) -> str:
        return self.title or self.name

    def fallbacks_after(self, preferred: str, registered: Sequence[str]) -> tuple[str, ...]:
        return tuple(name for name in dict.fromkeys(self.fallback_programs or registered) if name != preferred)

    @property
    def is_builtin(self) -> bool:
        return bool(self.module)

    @classmethod
    def parsed(cls, fields: Mapping[str, Any]) -> "AgentProfile":
        access = Access(fields["access"]) if fields["access"] is not None else None
        tier = ModelTier.automatic(fields["tier"]) if fields.get("tier") is not None else None
        return replace(cls(**fields), access=access, tier=tier, mcp_tools=tuple(fields["mcp_tools"]), writable_folders=tuple(fields.get("writable_folders", ())), skills=tuple(fields.get("skills", ())), required_skills=tuple(fields.get("required_skills", ())), fallback_programs=tuple(fields.get("fallback_programs", ())), changed=tuple(fields["changed"]), notes=tuple(fields.get("notes", ())))
