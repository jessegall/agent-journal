from core.base.database.database import Database
from core.base.registry.registry import Registry
from tests.unit.core.modules.memories.support.memory_journal import MemoryJournal


def test_sync_records_the_memory_module_s_models_rules_overlay_and_listeners(tmp_path):
    registry = Registry.read(MemoryJournal.synced(tmp_path).container.get(Database))
    assert {"memory", "memory-type", "memory-type-switch", "memory-keyword", "memory-giving", "memory-mark"} <= set(registry.models)
    assert {"memories.give-at-start", "memories.open-mark", "memories.give-by-keyword", "memories.give-when-due"} <= {rule.name for rule in registry.rules}
    assert "memories.weighing" in {overlay.name for overlay in registry.overlays}
    assert {"memories.compaction-fader", "memories.task-memory-remover", "memories.mark-closer"} <= {listener.name for listener in registry.listeners}

