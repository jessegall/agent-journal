from core.modules.drivers.models.agent_block import AgentBlock
from core.modules.plugins.support.block_projection import BlockProjection
from engine.time.timestamp import Timestamp


def block(**fields: object) -> AgentBlock:
    return AgentBlock(session_agent_id=4, creator_id=4, agent_message_key="documents.open", agent_message_text="close document 41", condition_name="doc-closed",
                      condition_text="41", **fields)


def test_an_open_stop_hold_under_an_escalation_is_told_apart_from_one_that_refuses_the_stop_now():
    deferred = BlockProjection.projected(block(scope_stop=True, escalation_id=4))
    refusing = BlockProjection.projected(block(scope_stop=True))
    skipped = BlockProjection.projected(block(closed_at=Timestamp.parsed("2026-11-16T06:00:00+00:00"), closed_reason="waived", closer="agent:3"))
    assert (deferred["stop_deferred"], refusing["stop_deferred"], skipped["waived_by"], deferred["version"]) == (True, False, "agent:3", 2)
