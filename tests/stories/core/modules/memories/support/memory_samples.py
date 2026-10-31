from core.base.database.migration import Migration
from core.base.database.timestamp_sql import TIMESTAMP_SQL
from core.base.module.module import Module

VOICE = "tests.stories.core.modules.memories.support.memory_samples:VoiceModule"


class VoiceMemoryTypes(Migration):
    """Adds the voice memory type, on in every suite."""

    number = 1
    statements = (
        "INSERT INTO memory_types (creator_id, name, module, description, agent_writable, fades, starting_weight, start_delivery, mark_delivery,"
        f" keyword_delivery, created_at, updated_at) VALUES (1, 'voice', 'voice', 'the words the project uses', 1, 0, 8, 1, 0, 1, {TIMESTAMP_SQL}, {TIMESTAMP_SQL})",
        "INSERT INTO memory_type_switches (creator_id, type, suite, module, enabled, created_at, updated_at)"
        f" VALUES (1, 'voice', '*', 'voice', 1, {TIMESTAMP_SQL}, {TIMESTAMP_SQL})",
    )


class VoiceModule(Module):
    """A sample module that adds a memory type of its own."""

    name = "voice"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.memories"]
    migrations = [VoiceMemoryTypes]
