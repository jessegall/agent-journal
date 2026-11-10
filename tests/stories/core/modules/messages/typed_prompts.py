import pytest

from core.base.provider.transcript_entries import TranscriptEntries
from engine.query.queries import Queries
from core.modules.drivers.models.hook_call import HookCall
from core.testing.hook_samples import HookSamples
from tests.stories.core.modules.messages.lost_hooks import TOOL_FINISHED, codex_row, expect_chat_count, run_hook, transcript, prompt_row, entry_timestamp
from tests.stories.core.support.coding_fixtures import UserBuilder


def prompt_summaries(story) -> list[str]:
    return [call.summary for call in story.container.get(Queries).query(HookCall).filter(hook="prompt").oldest().all_rows()]


@pytest.fixture
def builder(new_story):
    return new_story(fixture=UserBuilder)


def test_a_lost_prompt_is_recorded_once_over_run_hooks(builder, tmp_path):
    path = transcript(tmp_path, prompt_row(builder, "please look at the cart"))
    run_hook(builder, path, TOOL_FINISHED)
    builder.container.bind(TranscriptEntries, TranscriptEntries())
    run_hook(builder, path, TOOL_FINISHED)
    builder.expect_rows(prompt_summaries(builder) == ["please look at the cart"])


def test_a_typed_prompt_is_read_already_and_asks_for_no_reply(builder):
    builder.hook("s-1", HookSamples.prompt("please look at the cart"))
    builder.expect_no_text("message unread", "please look at the cart", actor=builder.agent)
    builder.expect_absent_hook_line("s-1", HookSamples.edit("src/cart.py"), "please look at the cart")
    response = builder.hook("s-1", HookSamples.edit("src/cart.py"))
    builder.expect_rows(not any("new message" in line or "unanswered" in line for line in response.lines))


def test_a_lost_typed_prompt_shows_in_the_chat_once(builder, tmp_path):
    path = transcript(tmp_path, prompt_row(builder, "please look at the cart"))
    run_hook(builder, path, TOOL_FINISHED)
    builder.container.bind(TranscriptEntries, TranscriptEntries())
    run_hook(builder, path, TOOL_FINISHED)
    expect_chat_count(builder, "please look at the cart", 1)


def test_the_words_of_a_scheduled_job_running_are_not_in_the_chat(builder):
    builder.hook("s-1", HookSamples.sample("post_tool_use", {"name": "CronCreate", "category": "other", "files": [], "diff": None}).with_raw({"tool_input": {"cron": "0 9 * * *", "prompt": "check the deploy", "recurring": True}, "tool_response": "Scheduled job 9f8e7d6c"}))
    builder.hook("s-1", HookSamples.prompt("check the deploy"))
    expect_chat_count(builder, "check the deploy", 0)
