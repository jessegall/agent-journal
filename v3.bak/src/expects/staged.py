"""What an expectation stages on disk before the registration runs: a line of an agent's transcript."""

import json


def in_a_transcript(text: str) -> str:
    """One line of a Claude transcript in which the agent said the text."""
    return json.dumps({"type": "assistant", "timestamp": "2026-01-01T00:00:00+00:00", "message": {"content": [{"type": "text", "text": text}]}}) + "\n"
