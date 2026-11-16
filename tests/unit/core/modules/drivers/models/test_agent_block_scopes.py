from engine.time.timestamp import Timestamp
from core.modules.drivers.models.agent_block import AgentBlock


def block(**fields: object) -> AgentBlock:
    return AgentBlock(session_agent_id=4, creator_id=4, agent_message_key="documents.open", agent_message_text="close document 41", condition_name="doc-closed",
                      condition_text="41", **fields)


def test_a_block_refuses_tools_unless_it_holds_the_stop_only() -> None:
    stop_hold = block(scope_tools=False, scope_stop=True)
    assert (block().scope_tools, block().blocks_stop, stop_hold.blocks_stop, stop_hold.is_active(0, Timestamp.parsed("2026-11-16T06:00:00+00:00"))) == (True, False, True, False)


def test_a_row_with_both_scopes_refuses_tools_and_the_stop() -> None:
    pair = block(scope_tools=True, scope_stop=True)
    assert (pair.scope_tools, pair.scope_stop, pair.blocks_stop) == (True, True, False)
