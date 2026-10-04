from providers.claude_driver import ClaudeDriver
from providers.codex_driver import CodexDriver
from providers.base import LIBRARY
from providers.catalogue import PROVIDER_TYPES, workspace_folders  # noqa: F401

PROVIDERS = {p.name: p for p in PROVIDER_TYPES}

DRIVERS = {d.name: d for d in (ClaudeDriver, CodexDriver)}


def skill_folders() -> tuple[str, ...]:
    return (LIBRARY, *(cls.skill_home for cls in PROVIDERS.values() if cls.skill_home))


def dispatch_model(provider: str, chosen: str) -> str:
    found = PROVIDERS.get(provider)
    return found().dispatch_model(chosen) if found else chosen
