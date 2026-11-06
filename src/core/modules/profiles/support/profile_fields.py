from typing import TypedDict

from core.base.access import Access


class ProfileFields(TypedDict, total=False):
    name: str
    title: str
    description: str
    body: str
    agent_type: str
    access: Access
    program: str
    model: str
    codex_model: str
    independent: bool
    mcp_tools: tuple[str, ...]
    module: str
    module_text: str
    source_digest: str
    legacy_writing: str
    tools: str
