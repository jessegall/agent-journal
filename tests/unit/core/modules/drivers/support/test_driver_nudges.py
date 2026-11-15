from core.modules.drivers.nudges.agent_compacted_message import AgentCompactedMessage
from core.modules.drivers.nudges.cache_keepalive_message import CacheKeepaliveMessage
from core.modules.drivers.nudges.compaction_notice_message import CompactionNoticeMessage
from core.modules.drivers.nudges.hook_timeouts_message import HookTimeoutsMessage
from core.modules.drivers.nudges.journal_started_message import JournalStartedMessage
from core.modules.drivers.nudges.permission_requested_message import PermissionRequestedMessage
from core.modules.drivers.nudges.safeguards_stopped_message import SafeguardsStoppedMessage
from engine.enums.line_delivery import LineDelivery


def test_the_driver_nudges_that_wake_an_idle_agent_use_the_wake_hook():
    nudges = [declaration.declared() for declaration in (HookTimeoutsMessage, PermissionRequestedMessage, CacheKeepaliveMessage, CompactionNoticeMessage, JournalStartedMessage)]
    assert all(nudge.wakes_agent and nudge.delivery is LineDelivery.WAKE_HOOK for nudge in nudges)


def test_the_driver_nudges_after_a_failure_or_a_compaction_keep_terminal_typing():
    assert all(declaration.declared().delivery is LineDelivery.TERMINAL_TYPING for declaration in (SafeguardsStoppedMessage, AgentCompactedMessage))
