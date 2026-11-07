import json

import pytest

from core.modules.codex.providers.codex_provider import CodexProvider


def rollout_line(role: str, text: str) -> str:
    return json.dumps({"timestamp": "2026-11-03T12:46:10Z", "payload": {"role": role, "content": [{"type": "input_text", "text": text}]}})


@pytest.mark.parametrize("text", ["# AGENTS.md instructions for /work\n\n<INSTRUCTIONS>", "<environment_context>\n  <cwd>/work</cwd>", "<permissions instructions>\nall"])
def test_what_codex_gives_itself_as_context_is_no_row_of_the_transcript(text):
    assert CodexProvider.transcript_row(object.__new__(CodexProvider), rollout_line("user", text), 1) is None


def test_a_hook_prompt_shows_as_its_plain_words():
    line = rollout_line("user", '<hook_prompt hook_run_id="stop:8">say why with &lt;why&gt;</hook_prompt>')
    assert object.__new__(CodexProvider).transcript_row(line, 1).text == "say why with <why>"


def test_a_line_from_the_journal_is_a_row_by_the_journal():
    row = object.__new__(CodexProvider).transcript_row(rollout_line("developer", "your run 12 ended"), 1)
    assert (row.author, row.text) == ("journal", "your run 12 ended")


def test_the_brief_and_the_answer_are_rows_of_the_transcript():
    provider = object.__new__(CodexProvider)
    assert provider.transcript_row(rollout_line("user", "You are worker 446"), 1) is not None
    assert provider.transcript_row(rollout_line("assistant", "I will read the guidance"), 2) is not None


def test_a_block_of_codex_own_context_is_hidden_and_the_journal_block_beside_it_stays():
    line = json.dumps({"payload": {"role": "developer", "content": [{"text": "<skills_instructions>\nSkills"}, {"text": "<collaboration_mode>Mode"}, {"text": "You are a worker"}]}})
    assert CodexProvider.transcript_row(object.__new__(CodexProvider), line, 1).text == "You are a worker"


def test_a_message_of_codex_own_context_alone_shows_nothing():
    line = json.dumps({"payload": {"role": "developer", "content": [{"text": "<skills_instructions>\nSkills"}, {"text": "<recommended_plugins>\nPlugins"}]}})
    assert CodexProvider.transcript_row(object.__new__(CodexProvider), line, 1) is None
