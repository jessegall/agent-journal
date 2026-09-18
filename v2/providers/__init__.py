from v2.providers.claude import Claude
from v2.providers.codex import Codex

PROVIDERS = {p.name: p for p in (Claude, Codex)}
