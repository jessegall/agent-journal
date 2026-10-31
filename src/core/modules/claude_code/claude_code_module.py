from core.base.module.module import Module
from core.modules.claude_code.providers.claude_code_provider import ClaudeCodeProvider


class ClaudeCodeModule(Module):
    """Adds Claude Code as an agent program."""

    name = "journal.core.claude_code"
    requires_core = ">=5,<6"
    providers = [ClaudeCodeProvider]
