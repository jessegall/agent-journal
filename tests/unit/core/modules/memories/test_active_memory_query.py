from core.base.database.statement import Statement
from core.base.timestamp import Timestamp
from core.modules.memories.active_memory_query import ActiveMemoryQuery
from tests.unit.core.modules.memories.support.memory_journal import NOW, MemoryJournal

LATER = "2026-11-01T09:00:00+00:00"


def memories(tmp_path) -> tuple[MemoryJournal, ActiveMemoryQuery]:
    journal = MemoryJournal.synced(tmp_path)

    def make(text: str, environment_id: int | None, agent_id: int | None, memory_type: str = "fact", weight: int = 5, due_at: str | None = None) -> None:
        journal.database.insert(Statement("INSERT INTO memories (environment_id, agent_id, creator_id, type, text, weight, due_at, created_at, updated_at)"
                                          " VALUES (?, ?, 1, ?, ?, ?, ?, ?, ?)", (environment_id, agent_id, memory_type, text, weight, due_at, NOW, NOW)))

    make("project rule", None, None, memory_type="rule", weight=10)
    make("environment fact", 1, None)
    make("own reminder", 1, journal.first_agent, memory_type="reminder")
    make("second agent's fact", 1, journal.second_agent)
    make("faded fact", 1, None, weight=0)
    make("due reminder", 1, None, memory_type="reminder", due_at=LATER)
    return journal, journal.container.get(ActiveMemoryQuery)


def texts(query: ActiveMemoryQuery) -> list[str]:
    return [memory.text for memory in query.all_rows()]


def test_an_agent_stands_under_the_project_its_environment_and_its_own_memories_and_no_other_agents(tmp_path):
    journal, query = memories(tmp_path)
    assert sorted(texts(query.scope(journal.first_agent, 1))) == ["due reminder", "environment fact", "own reminder", "project rule"]


def test_a_memory_at_weight_0_no_longer_stands(tmp_path):
    journal, query = memories(tmp_path)
    assert "faded fact" not in texts(query)


def test_the_delivery_order_puts_rules_first_then_reminders_then_the_rest(tmp_path):
    journal, query = memories(tmp_path)
    ordered = texts(query.scope(journal.first_agent, 1).delivery_order())
    assert ordered[0] == "project rule" and ordered[-1] == "environment fact"


def test_a_memory_with_a_due_time_is_due_only_once_that_time_has_come(tmp_path):
    journal, query = memories(tmp_path)
    assert texts(query.due(Timestamp.parsed(NOW))) == []
    assert texts(query.due(Timestamp.parsed(LATER))) == ["due reminder"]


def test_only_fading_types_are_read_as_fading(tmp_path):
    journal, query = memories(tmp_path)
    assert sorted(texts(query.fading())) == ["environment fact", "second agent's fact"]
