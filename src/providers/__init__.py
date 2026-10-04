from providers.claude import Claude, ClaudeDriver
from providers.codex import Codex, CodexDriver
from providers.base import LIBRARY

PROVIDERS = {p.name: p for p in (Claude, Codex)}

DRIVERS = {d.name: d for d in (ClaudeDriver, CodexDriver)}


def skill_folders() -> tuple[str, ...]:
    return (LIBRARY, *(cls.skill_home for cls in PROVIDERS.values() if cls.skill_home))


def dispatch_model(provider: str, chosen: str) -> str:
    found = PROVIDERS.get(provider)
    return found().dispatch_model(chosen) if found else chosen
