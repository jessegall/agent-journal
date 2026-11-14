from core.modules.developer.support.developer_nudges import EXCEPTION_LINE
from core.modules.messages.support import message_nudges
from engine.driver.line_delivery import LineDelivery
from engine.driver.nudge_declaration import NudgeDeclaration


def test_message_nudges_that_wake_an_agent_use_the_wake_hook():
    declared = [value for value in vars(message_nudges).values() if isinstance(value, NudgeDeclaration)]
    waking = [nudge for nudge in declared if nudge.wakes_agent]
    assert waking and all(nudge.delivery is LineDelivery.WAKE_HOOK for nudge in [*waking, EXCEPTION_LINE])
