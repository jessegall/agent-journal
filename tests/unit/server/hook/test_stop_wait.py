from server.hook.hook_sender import HookSender
from server.hook.hook_limits import STOP_LIMIT_SECONDS


def test_a_stop_waits_longer_for_the_journal_than_other_hooks():
    stop = HookSender.parsed({"hook_event_name": "Stop"}, role_of=lambda session: "main")
    tool = HookSender.parsed({"hook_event_name": "PreToolUse"}, role_of=lambda session: "main")
    assert (stop.limit_seconds, tool.limit_seconds < STOP_LIMIT_SECONDS) == (STOP_LIMIT_SECONDS, True)
