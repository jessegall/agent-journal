from providers.claude import Claude
from providers.codex import Codex

PROVIDERS = {p.name: p for p in (Claude, Codex)}
