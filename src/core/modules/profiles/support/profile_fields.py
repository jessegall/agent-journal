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
    model: str
    tier: ModelTier | None
    codex_model: str
    independent: bool
    mcp_tools: tuple[str, ...]
    module: str
    module_text: str
    source_digest: str
    legacy_writing: str
    tools: str
