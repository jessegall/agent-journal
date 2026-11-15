from core.modules.drivers.nudges.agent_compacted_nudge import AgentCompactedNudge
from core.modules.drivers.nudges.cache_keepalive_nudge import CacheKeepaliveNudge
from core.modules.drivers.nudges.compaction_notice_nudge import CompactionNoticeNudge
from core.modules.drivers.nudges.hook_timeouts_nudge import HookTimeoutsNudge
from core.modules.drivers.nudges.permission_requested_nudge import PermissionRequestedNudge
from core.modules.drivers.nudges.safeguards_stopped_nudge import SafeguardsStoppedNudge
from engine.enums.line_delivery import LineDelivery


def test_the_driver_nudges_that_wake_an_idle_agent_use_the_wake_hook():
    nudges = [declaration.declared() for declaration in (HookTimeoutsNudge, PermissionRequestedNudge, CacheKeepaliveNudge, CompactionNoticeNudge)]
    assert all(nudge.wakes_agent and nudge.delivery is LineDelivery.WAKE_HOOK for nudge in nudges)


def test_the_driver_nudges_after_a_failure_or_a_compaction_keep_terminal_typing():
    assert all(declaration.declared().delivery is LineDelivery.TERMINAL_TYPING for declaration in (SafeguardsStoppedNudge, AgentCompactedNudge))
