from core.modules.claude_code.support.claude_code_settings import CLAUDE_CODE_SETTINGS
from engine.module.module import Module
from core.modules.claude_code.providers.claude_code_provider import ClaudeCodeProvider
from core.modules.claude_code.rules.native_memory_rule import NativeMemoryRule
from core.modules.claude_code.support.claude_code_nudges import CLAUDE_CODE_NUDGES


class ClaudeCodeModule(Module):
    """Adds Claude Code as an agent program."""

    name = "journal.core.claude_code"
    seed_reason = "it keeps no rows"
    move_reason = "version 4 had no table for an agent program"
    requires_core = ">=5,<6"
    providers = [ClaudeCodeProvider]
    driver_rules = [NativeMemoryRule]
    nudges = CLAUDE_CODE_NUDGES
    settings = CLAUDE_CODE_SETTINGS
