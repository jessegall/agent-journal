import json

from core.modules.codex.providers.support.codex_token_count import CodexTokenCount

ROLLOUT_RECORD = json.dumps({"timestamp": "2026-11-06T21:03:11.402Z", "ordinal": 812, "type": "event_msg", "payload": {"type": "token_count", "info": {
    "total_token_usage": {"input_tokens": 11328196, "cached_input_tokens": 11024640, "cache_write_input_tokens": 0, "output_tokens": 18042, "reasoning_output_tokens": 5230, "total_tokens": 11346238},
    "last_token_usage": {"input_tokens": 150210, "cached_input_tokens": 150000, "cache_write_input_tokens": 0, "output_tokens": 180, "reasoning_output_tokens": 114, "total_tokens": 150390},
    "model_context_window": 475000}, "rate_limits": {"primary": None}}})


def test_a_token_count_record_of_a_rollout_gives_the_last_turn_tokens_of_the_window():
    count = CodexTokenCount.parsed(ROLLOUT_RECORD)
    assert count == CodexTokenCount(150390, 475000)
    assert count.percent() == 31


def test_a_token_count_without_a_usage_or_a_window_is_no_count():
    assert CodexTokenCount.parsed(json.dumps({"payload": {"type": "token_count", "info": None}})) is None
    assert CodexTokenCount.parsed(json.dumps({"payload": {"type": "agent_message"}})) is None
    assert CodexTokenCount.parsed("") is None
