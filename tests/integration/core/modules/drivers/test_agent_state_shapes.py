from datetime import timedelta
from pathlib import Path

import pytest

from engine.enums.command_category import CommandCategory
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from engine.testing.stories.story_fixture import StoryFixture
from core.modules.drivers.models.agent_block import AgentBlock
from core.modules.messages.rules.unread_message_write_rule import UnreadMessageWriteRule
from tests.integration.support.fixture_journal import FixtureJournal
from tests.stories.core.support.agent_labels import agent_number
from tests.stories.core.support.coding_fixtures import BuilderStarted, UserBuilder
from tests.integration.support.fixture_journal import FixtureJournal

LISTING = HookSamples.shell("ls", ShellPart("ls", CommandCategory.READ, []))
LONG_LISTING = HookSamples.shell("ls -l", ShellPart("ls", CommandCategory.READ, ["-l"]))


@pytest.fixture(autouse=True)
def listeners_run_at_hook(monkeypatch):
    original = FixtureJournal.hook

    def hook_after_listeners(story, *arguments, **options):
        story.run_listeners()
        story.advance(timedelta(seconds=1))
        return original(story, *arguments, **options)

    monkeypatch.setattr(FixtureJournal, "hook", hook_after_listeners)


def test_a_module_starts_a_countdown_in_one_line_and_the_agent_reads_the_same_line_as_before(played):
    story = played(UserBuilder)
    story.expect_success('message send "Read me" --environment main', actor=story.user)
    story.hook("s-1", HookSamples.prompt("Carry on"))
    replies = [story.hook("s-1", LISTING) for _ in range(19)]
    lines = [line for line in replies[-1].lines if "read message 1" in line]
    story.expect_rows(len(lines) == 1, "due:" in lines[0] and "tool use" in lines[0], detail=str(replies[-1].lines))


class MessageUnread(StoryFixture):
    """The builder has a message it has not read, and has sent its first prompt."""

    parent = UserBuilder

    def steps(self, story):
        story.expect_success('message send "Read me" --environment main', actor=story.user)
        story.hook("s-1", HookSamples.prompt("Carry on"))


def test_an_open_message_block_does_not_open_the_skill_countdown_state(played):
    story = played(MessageUnread)
    story.hook("s-1", LISTING)
    shown = story.run(f"driver states {agent_number(story, story.agent.id)}", actor=story.agent).output_text
    story.expect_rows("messages.unread-countdown" in shown, "skills.skill-block" not in shown, detail=shown)


def test_the_coding_suite_adds_its_own_shape_and_core_and_the_engine_never_name_it(played):
    story = played(BuilderStarted)
    story.expect_text("driver state-types", "workers.worker-log-due", "journal.suites.coding.workers", actor=story.agent)
    source = Path(__file__).resolve().parents[5] / "src"
    naming = [file for folder in ("core", "engine") for file in (source / folder).rglob("*.py") if "WorkerLogDue" in file.read_text() or "worker-log-due" in file.read_text()]
    story.expect_rows(naming == [], detail=str(naming))


def test_a_rule_pushes_a_countdown_by_its_answer_alone_and_the_hook_record_writes_the_block(played, monkeypatch):
    story = played(MessageUnread)
    answer = UnreadMessageWriteRule.answer
    rows_at_answer = []

    def watched(rule, hook):
        rows_at_answer.append(len(story.story_rows(AgentBlock)))
        return answer(rule, hook)

    monkeypatch.setattr(UnreadMessageWriteRule, "answer", watched)
    previous = len(story.story_rows(AgentBlock))
    story.hook("s-1", LONG_LISTING)
    after = [block for block in story.story_rows(AgentBlock) if block.closed_at is None]
    story.expect_rows(rows_at_answer == [previous], len(after) == previous + 1, detail=f"{rows_at_answer} {previous} {len(after)}")
