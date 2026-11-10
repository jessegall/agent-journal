from core.base.provider.context_window import ContextWindow
from core.modules.settings.bindings.support.context_share import CONTEXT_LIMIT_ENABLED, CONTEXT_LIMIT_TOKENS, ContextShare

USED_TOKENS = 126000


class FakeSettings:
    def __init__(self, enabled: bool, limit: int) -> None:
        self.values = {CONTEXT_LIMIT_ENABLED: enabled, CONTEXT_LIMIT_TOKENS: limit}

    def flag(self, key: str) -> bool:
        return self.values[key]

    def number(self, key: str) -> int:
        return self.values[key]


def share(enabled: bool, limit: int) -> ContextShare:
    return ContextShare(FakeSettings(enabled, limit), None, None)


def test_a_limit_above_the_window_leaves_the_window_as_the_maximum_and_caps_nothing():
    reading = share(True, 400000).reading(ContextWindow(63, USED_TOKENS))
    assert (reading.percent, reading.used_tokens, reading.limit_tokens, reading.window_tokens) == (63, USED_TOKENS, None, 200000)


def test_a_limit_below_the_window_caps_the_context_and_the_window_is_still_read():
    reading = share(True, 100000).reading(ContextWindow(63, USED_TOKENS))
    assert (reading.percent, reading.limit_tokens, reading.window_tokens) == (100, 100000, 200000)


def test_no_limit_leaves_the_window_as_the_maximum():
    reading = share(False, 100000).reading(ContextWindow(63, USED_TOKENS))
    assert (reading.percent, reading.limit_tokens, reading.window_tokens) == (63, None, 200000)
