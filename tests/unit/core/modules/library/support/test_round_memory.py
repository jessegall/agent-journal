from types import SimpleNamespace

from core.modules.library.support.round_memory import RoundMemory

COPY = SimpleNamespace(id=4, version=2)
ROW = SimpleNamespace(version=7)
ENTRY = SimpleNamespace(version=3)


def test_a_copy_remembered_unchanged_is_unchanged_until_its_copy_its_row_or_its_server_entry_changes():
    memory = RoundMemory()
    assert not memory.is_unchanged(COPY, ROW, ENTRY)
    memory.remember_unchanged(COPY, ROW, ENTRY)
    assert memory.is_unchanged(COPY, ROW, ENTRY)
    assert not memory.is_unchanged(SimpleNamespace(id=4, version=3), ROW, ENTRY)
    assert not memory.is_unchanged(COPY, SimpleNamespace(version=8), ENTRY)
    assert not memory.is_unchanged(COPY, ROW, SimpleNamespace(version=4))
    assert not memory.is_unchanged(SimpleNamespace(id=5, version=2), ROW, ENTRY)
