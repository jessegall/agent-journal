from engine.enums.block_end import BlockEnd
from engine.model.table import stored
from core.modules.drivers.models.agent_block import AgentBlock
from core.modules.plugins.support.plugin_block_fields import PluginBlockFields

BLOCK_PROJECTION_VERSION = 2


class BlockProjection:
    """Version 2 of the hold contract a plugin reads beside the version 1 row (doc 1310 section 10.13): the
    scopes, the ends, who waived it, why it closed, its escalation, and whether an open
    escalation defers the stop it holds, so a plugin tells an open hold from one refusing the stop now."""

    @staticmethod
    def projected(block: AgentBlock) -> PluginBlockFields:
        is_open = block.closed_at is None
        return PluginBlockFields(**{"version": BLOCK_PROJECTION_VERSION, "scope_tools": stored(block.scope_tools), "scope_stop": stored(block.scope_stop), "ends": stored(block.ends),
                                    "waived_by": block.closer if block.closed_reason == BlockEnd.SKIPPED.value else "", "closed_reason": block.closed_reason,
                                    "escalation_id": block.escalation_id, "stop_deferred": bool(is_open and block.scope_stop and block.escalation_id is not None)})
