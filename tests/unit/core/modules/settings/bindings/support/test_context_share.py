from types import SimpleNamespace

from engine.provider.context_window import ContextWindow
from core.modules.settings.bindings.support.context_share import CONTEXT_LIMIT_ENABLED, CONTEXT_LIMIT_TOKENS, ContextShare

USED_TOKENS = 126000
AGENT = SimpleNamespace(role="helper", profile="")


class FakeSettings:
    def __init__(self, enabled: bool, limit: int) -> None:
        self.values = {CONTEXT_LIMIT_ENABLED: enabled, CONTEXT_LIMIT_TOKENS: limit}

    def flag(self, key: str) -> bool:
        return self.values[key]

    def number(self, key: str) -> int:
        return self.values[key]

    def texts(self, key: str) -> tuple[str, ...]:
        return tuple(self.values.get(key, ()))


def share(enabled: bool, limit: int) -> ContextShare:
    return ContextShare(FakeSettings(enabled, limit), None, None)


def test_a_limit_above_the_window_leaves_the_window_as_the_maximum_and_caps_nothing():
    context = share(True, 400000).window_reading(AGENT, ContextWindow(63, USED_TOKENS))
    assert (context.percent, context.used_tokens, context.limit_tokens, context.window_tokens) == (63, USED_TOKENS, None, 200000)


def test_a_limit_below_the_window_caps_the_context_and_the_window_is_still_read():
    context = share(True, 100000).window_reading(AGENT, ContextWindow(63, USED_TOKENS))
    assert (context.percent, context.limit_tokens, context.window_tokens) == (100, 100000, 200000)


def test_no_limit_leaves_the_window_as_the_maximum():
    context = share(False, 100000).window_reading(AGENT, ContextWindow(63, USED_TOKENS))
    assert (context.percent, context.limit_tokens, context.window_tokens) == (63, None, 200000)


def test_the_window_size_the_program_reports_is_used_over_the_one_worked_out_from_the_percent():
    context = share(True, 400000).window_reading(AGENT, ContextWindow(68, 136261, None, 200000))
    assert (context.limit_tokens, context.window_tokens) == (None, 200000)


def test_a_status_file_gives_the_window_size():
    window = ContextWindow.parsed({"context_window": {"used_percentage": 68, "total_input_tokens": 136261, "context_window_size": 200000}}, None)
    assert window.window_size_tokens == 200000
