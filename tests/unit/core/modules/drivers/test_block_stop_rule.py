from engine.enums.role_group import RoleGroup
from core.modules.drivers.rules.agent_block_rule import AgentBlockRule
from core.modules.drivers.rules.block_stop_rule import BlockStopRule


def test_a_stop_is_held_only_for_the_roles_whose_monitor_can_close_the_block():
    assert BlockStopRule.role_group is RoleGroup.PROMPT
    assert BlockStopRule.role_group is AgentBlockRule.role_group
