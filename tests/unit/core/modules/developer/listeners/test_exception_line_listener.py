from core.modules.developer.listeners.exception_line_listener import ExceptionLineListener


def test_exception_line_listener_reset_clears_round_state():
    listener = ExceptionLineListener(settings=object(), agents=object(), bus=object())
    listener.told_messages.add("the round failed")
    listener.reset()
    assert listener.told_messages == set()
