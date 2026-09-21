from providers.claude import Claude, ClaudeDriver
from providers.codex import Codex, CodexDriver

PROVIDERS = {p.name: p for p in (Claude, Codex)}

DRIVERS = {d.name: d for d in (ClaudeDriver, CodexDriver)}
