from server.hook.hook_sender import HookSender
from server.request.server_context import STOP_LIMIT_SECONDS


def test_a_stop_waits_longer_for_the_journal_than_other_hooks():
    stop = HookSender.parsed({"role": "main", "hook_event_name": "Stop"})
    tool = HookSender.parsed({"role": "main", "hook_event_name": "PreToolUse"})
    assert (stop.limit_seconds, tool.limit_seconds < STOP_LIMIT_SECONDS) == (STOP_LIMIT_SECONDS, True)
