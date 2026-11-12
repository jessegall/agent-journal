from dataclasses import dataclass, field
from collections.abc import Mapping, Sequence
from typing import Any
from engine.enums.access import Access
from engine.enums.model_tier import ModelTier
from engine.enums.occupant import INDEPENDENT_OCCUPANTS, Occupant

KEPT_AGENTS_TEXT = "agents are kept; a person retires them"
SEQUENCE_FIELDS = ("fallback_programs", "mcp_tools", "writable_folders", "changed", "notes", "skills", "required_skills", "default_fields")


@dataclass(frozen=True)
class AgentProfile:
    """Instructions and program settings for one type of agent, with its usage counts. A profile built on a base
    takes each setting it leaves at its default from that base, except the settings named in default_fields, which
    it sets to their default over the base's."""

    name: str
    description: str = ""
    body: str = ""
    base: str = ""
    agent_type: str = "helper"
    access: Access | None = None
    program: str = ""
    preferred_program: bool = True
    fallback_programs: tuple[str, ...] = ()
    model: str = ""
    codex_model: str = ""
    tier: ModelTier | None = None
    occupant: Occupant = Occupant.COLD_ROTATION
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
    default_fields: tuple[str, ...] = ()

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
        if "reuse" in fields:
            raise ValueError(KEPT_AGENTS_TEXT)
        occupant = Occupant(fields["occupant"]) if "occupant" in fields else INDEPENDENT_OCCUPANTS[fields.get("independent", False) is True]
        current = {name: value for name, value in fields.items() if name != "independent"}
        sequences = {name: tuple(current[name]) for name in SEQUENCE_FIELDS if name in current}
        access = Access(fields["access"]) if fields["access"] is not None else None
        tier = ModelTier.automatic(fields["tier"]) if fields.get("tier") is not None else None
        values: dict[str, Any] = {**current, **sequences, "occupant": occupant, "access": access, "tier": tier}
        return cls(**values)
