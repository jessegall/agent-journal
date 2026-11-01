from core.base.module.module import Module
from core.modules.developer.support.developer_settings import DEVELOPER_SETTINGS


class DeveloperModule(Module):
    """Adds the developer settings: one switch and the groups inside it, for working on the journal itself."""

    name = "journal.core.developer"
    seed_reason = "its settings are the person's own choice"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.settings"]
    settings = DEVELOPER_SETTINGS
