from contextlib import nullcontext
from datetime import datetime, timezone
from types import SimpleNamespace

from core.modules.memories.commands.give_memories.give_memories import GiveMemories
from core.modules.memories.listeners.start_memories_listener import StartMemoriesListener
from core.modules.memories.models.enums.delivery_cause import DeliveryCause

RETIRED_AT = datetime(2026, 11, 2, 9, 0, tzinfo=timezone.utc)
AGENT_ID = 7
MEMORY_IDS = (31, 32)


class ActiveMemories:
    """The active memories an agent has not been given, as a query that answers itself at each step."""

    def absent_memories(self, agent_id: int) -> "ActiveMemories":
        return self

    def weight_order(self) -> "ActiveMemories":
        return self

    def full_table(self, reason: str) -> "ActiveMemories":
        return self

    def all_rows(self) -> list[SimpleNamespace]:
        return [SimpleNamespace(memory_id=memory_id) for memory_id in MEMORY_IDS]


def commands_at_a_session_start(role: str, retired_at: datetime | None) -> list[object]:
    commands: list[object] = []
    listener = StartMemoriesListener(ActiveMemories(), SimpleNamespace(find=lambda agent_id: SimpleNamespace(id=agent_id, role=role, retired_at=retired_at)),
                                     SimpleNamespace(run=lambda command, actor, cause_id: commands.append(command)), SimpleNamespace(actor=lambda module: SimpleNamespace()),
                                     SimpleNamespace(agent_policy=lambda: SimpleNamespace(prompt_roles=("main", "helper"))), SimpleNamespace(opened=lambda agent_id: nullcontext()))
    listener.handle(SimpleNamespace(row=SimpleNamespace(session_agent_id=AGENT_ID)), SimpleNamespace(id=90))
    return commands


def test_a_session_start_gives_an_agent_its_active_memories():
    assert commands_at_a_session_start("helper", None) == [GiveMemories(AGENT_ID, MEMORY_IDS, DeliveryCause.START)]


def test_a_retired_agent_is_given_no_memories():
    assert commands_at_a_session_start("helper", RETIRED_AT) == []


def test_an_agent_of_a_role_that_gets_no_prompt_is_given_no_memories():
    assert commands_at_a_session_start("worker", None) == []
