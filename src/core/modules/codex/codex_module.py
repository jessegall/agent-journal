from core.base.module.module import Module
from core.modules.codex.providers.codex_provider import CodexProvider
from core.modules.codex.commands.hook_trust_subcommand import HookTrustSubcommand


class CodexModule(Module):
    """Adds Codex as an agent program."""

    name = "journal.core.codex"
    requires_core = ">=5,<6"
    providers = [CodexProvider]
    subcommands = [HookTrustSubcommand]
