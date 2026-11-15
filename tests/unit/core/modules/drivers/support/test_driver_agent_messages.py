from core.modules.drivers.agent_messages.agent_compacted_message import AgentCompactedMessage
from core.modules.drivers.agent_messages.cache_keepalive_message import CacheKeepaliveMessage
from core.modules.drivers.agent_messages.compaction_notice_message import CompactionNoticeMessage
from core.modules.drivers.agent_messages.hook_timeouts_message import HookTimeoutsMessage
from core.modules.drivers.agent_messages.journal_started_message import JournalStartedMessage
from core.modules.drivers.agent_messages.permission_requested_message import PermissionRequestedMessage
from core.modules.drivers.agent_messages.safeguards_stopped_message import SafeguardsStoppedMessage
from engine.enums.line_delivery import LineDelivery


def test_the_driver_agent_messages_that_wake_an_idle_agent_use_the_wake_hook():
    agent_messages = [declaration.declared() for declaration in (HookTimeoutsMessage, PermissionRequestedMessage, CacheKeepaliveMessage, CompactionNoticeMessage, JournalStartedMessage)]
    assert all(agent_message.wakes_agent and agent_message.delivery is LineDelivery.WAKE_HOOK for agent_message in agent_messages)


def test_the_driver_agent_messages_after_a_failure_or_a_compaction_keep_terminal_typing():
    assert all(declaration.declared().delivery is LineDelivery.TERMINAL_TYPING for declaration in (SafeguardsStoppedMessage, AgentCompactedMessage))
