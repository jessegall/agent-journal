from core.base.module.module import Module
from core.modules.codex.providers.codex_provider import CodexProvider


class CodexModule(Module):
    """Adds Codex as an agent program."""

    name = "journal.core.codex"
    move_reason = "version 4 had no table for an agent program"
    requires_core = ">=5,<6"
    providers = [CodexProvider]
