from core.modules.drivers.support.driver_nudges import (AGENT_COMPACTED, AGENT_INTERRUPTED, CACHE_KEEPALIVE, COMPACTION_NOTICE, HOOK_TIMEOUTS, JOURNAL_STARTED,
                                                        PERMISSION_REQUESTED, SAFEGUARDS_STOPPED)
from engine.driver.line_delivery import LineDelivery


def test_the_driver_nudges_that_wake_an_idle_agent_use_the_wake_hook():
    nudges = (HOOK_TIMEOUTS, PERMISSION_REQUESTED, CACHE_KEEPALIVE, COMPACTION_NOTICE, JOURNAL_STARTED)
    assert all(nudge.wakes_agent and nudge.delivery is LineDelivery.WAKE_HOOK for nudge in nudges)


def test_the_driver_nudges_after_a_failure_an_interrupt_or_a_compaction_keep_terminal_typing():
    assert all(nudge.delivery is LineDelivery.TERMINAL_TYPING for nudge in (SAFEGUARDS_STOPPED, AGENT_COMPACTED, AGENT_INTERRUPTED))
