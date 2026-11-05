from core.base.module.module import Module


class HelpersModule(Module):
    """Starts and keeps helpers: extra agents the journal runs on any program, for a parent that hears from them by message."""

    name = "journal.core.helpers"
    seed_reason = "it keeps no rows of its own yet"
    move_reason = "version 4 had no helpers"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.agents", "journal.core.profiles", "journal.core.messages", "journal.core.drivers"]
