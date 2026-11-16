from core.modules.drivers.models.agent_block import AgentBlock


def block(**fields: object) -> AgentBlock:
    return AgentBlock(session_agent_id=4, creator_id=4, agent_message_key="documents.open", agent_message_text="close document 41", condition_name="doc-closed",
                      condition_text="41", **fields)


def test_a_row_old_code_wrote_reads_its_scope_from_blocks_stop() -> None:
    assert (block().has_tool_scope, block().has_stop_scope) == (True, False)
    assert (block(blocks_stop=True).has_tool_scope, block(blocks_stop=True).has_stop_scope) == (False, True)


def test_a_row_with_both_scopes_refuses_tools_and_the_stop() -> None:
    pair = block(scope_tools=True, scope_stop=True)
    assert (pair.has_tool_scope, pair.has_stop_scope) == (True, True)
