from core.modules.agents.support.report_nudges import PARENT_REPORT, REPORT_NUDGES
from engine.driver.line_delivery import LineDelivery


def test_the_parent_report_nudge_uses_the_wake_hook():
    assert PARENT_REPORT.wakes_agent and all(nudge.delivery is LineDelivery.WAKE_HOOK for nudge in REPORT_NUDGES if nudge.wakes_agent)
