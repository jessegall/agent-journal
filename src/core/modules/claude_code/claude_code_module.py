from core.modules.claude_code.policies.native_memory_policy import NativeMemoryPolicy
from core.modules.claude_code.support.claude_code_settings import CLAUDE_CODE_SETTINGS
from engine.module.module import Module
from core.modules.claude_code.providers.claude_code_provider import ClaudeCodeProvider
from core.modules.claude_code.support.claude_code_agent_messages import CLAUDE_CODE_AGENT_MESSAGES


class ClaudeCodeModule(Module):
    """Adds Claude Code as an agent program."""

    name = "journal.core.claude_code"
    policies = [NativeMemoryPolicy]
    seed_reason = "it keeps no rows"
    move_reason = "version 4 had no table for an agent program"
    requires_engine = ">=5,<6"
    providers = [ClaudeCodeProvider]
    agent_messages = CLAUDE_CODE_AGENT_MESSAGES
    settings = CLAUDE_CODE_SETTINGS
