from dataclasses import dataclass, field
from collections.abc import Mapping
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
    program_if_possible: bool = False
    model: str = ""
    codex_model: str = ""
    tier: ModelTier | None = None
    independent: bool = False
    mcp_tools: tuple[str, ...] = ()
    write_paths: tuple[str, ...] = ()
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
    program_models: Mapping[str, str] = field(default_factory=dict)

    @property
    def display_title(self) -> str:
        return self.title or self.name

    @property
    def is_builtin(self) -> bool:
        return bool(self.module)

    @classmethod
    def parsed(cls, fields: Mapping[str, Any]) -> "AgentProfile":
        access = Access(fields["access"]) if fields["access"] is not None else None
        tier = ModelTier.automatic(fields["tier"]) if fields.get("tier") is not None else None
        return cls(**{**fields, "access": access, "tier": tier, "mcp_tools": tuple(fields["mcp_tools"]), "write_paths": tuple(fields.get("write_paths", ())), "changed": tuple(fields["changed"]), "notes": tuple(fields.get("notes", ()))})
