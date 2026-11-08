from typing import TypedDict

from core.base.access import Access
from core.base.provider.model_tier import ModelTier


class ProfileFields(TypedDict, total=False):
    name: str
    title: str
    description: str
    body: str
    agent_type: str
    access: Access
    program: str
    program_if_possible: bool
    fallback_programs: tuple[str, ...]
    model: str
    tier: ModelTier | None
    codex_model: str
    program_models: dict[str, str]
    independent: bool
    keeps_project_instructions: bool
    injections: dict[str, bool]
    mcp_tools: tuple[str, ...]
    writable_folders: tuple[str, ...]
    module: str
    module_text: str
    source_digest: str
    legacy_writing: str
    tools: str
