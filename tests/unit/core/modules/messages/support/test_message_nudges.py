from core.modules.developer.nudges.exception_line_nudge import ExceptionLineNudge
from core.modules.messages.support import message_nudges
from engine.enums.line_delivery import LineDelivery
from engine.driver.nudge_declaration import NudgeDeclaration


def test_message_nudges_that_wake_an_agent_use_the_wake_hook():
    declared = [value.declared() for value in vars(message_nudges).values() if isinstance(value, type) and issubclass(value, NudgeDeclaration) and value is not NudgeDeclaration]
    waking = [nudge for nudge in declared if nudge.wakes_agent]
    assert waking and all(nudge.delivery is LineDelivery.WAKE_HOOK for nudge in [*waking, ExceptionLineNudge.declared()])
