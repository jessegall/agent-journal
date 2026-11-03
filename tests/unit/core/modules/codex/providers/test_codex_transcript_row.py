import json

import pytest

from core.modules.codex.providers.codex_provider import CodexProvider


def rollout_line(role: str, text: str) -> str:
    return json.dumps({"timestamp": "2026-11-03T12:46:10Z", "payload": {"role": role, "content": [{"type": "input_text", "text": text}]}})


@pytest.mark.parametrize("text", ["# AGENTS.md instructions for /work\n\n<INSTRUCTIONS>", "<environment_context>\n  <cwd>/work</cwd>", "<permissions instructions>\nall"])
def test_what_codex_gives_itself_as_context_is_no_row_of_the_transcript(text):
    assert CodexProvider.transcript_row(object.__new__(CodexProvider), rollout_line("user", text), 1) is None


def test_the_brief_and_the_answer_are_rows_of_the_transcript():
    provider = object.__new__(CodexProvider)
    assert provider.transcript_row(rollout_line("user", "You are worker 446"), 1) is not None
    assert provider.transcript_row(rollout_line("assistant", "I will read the guidance"), 2) is not None
