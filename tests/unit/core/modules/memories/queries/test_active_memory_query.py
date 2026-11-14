from engine.database.statement import Statement
from engine.time.timestamp import Timestamp
from core.modules.memories.queries.active_memory_query import ActiveMemoryQuery
from tests.unit.core.modules.memories.support.memory_journal import FIXED_TIME, MemoryJournal

TEST_ROWS_REASON = "the test reads every row it checks"


def memories(tmp_path) -> tuple[MemoryJournal, ActiveMemoryQuery]:
    journal = MemoryJournal.synced(tmp_path)

    def make(text: str, environment_id: int, agent_id: int | None, weight: int = 5) -> None:
        journal.database.insert(Statement("INSERT INTO memories (environment_id, agent_id, creator_id, text, weight, created_at, updated_at)"
                                          " VALUES (?, ?, 1, ?, ?, ?, ?)", (environment_id, agent_id, text, weight, FIXED_TIME, FIXED_TIME)))

    make("environment fact", 1, None)
    make("own fact", 1, journal.first_agent, weight=7)
    make("second agent's fact", 1, journal.second_agent)
    make("faded fact", 1, None, weight=0)
    return journal, journal.container.get(ActiveMemoryQuery)


def texts(query: ActiveMemoryQuery) -> list[str]:
    return [memory.text for memory in query.every_row(TEST_ROWS_REASON)]


def test_a_memory_at_weight_0_no_longer_stands(tmp_path):
    journal, query = memories(tmp_path)
    assert "faded fact" not in texts(query)
