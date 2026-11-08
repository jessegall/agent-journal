import shlex

import pytest

from tests.stories.core.support.fixtures import UserJoined

GUARD = "messages.question-tool"


@pytest.mark.parametrize("text", [
    "Do you want me to deploy now?",
    "Should I use SQLite or PostgreSQL?",
    "Which version should I install?\n- Stable\n- Preview",
    "SQLite or PostgreSQL?",
])
def test_a_choice_question_is_refused_and_recorded(new_story, text):
    story = new_story(fixture=UserJoined)
    story.expect_refusal(f"message send {shlex.quote(text)} --environment main", "journal question ask", actor=story.agent)
    records = [row for row in story.refusals() if row.guard == GUARD]
    story.expect_rows(len(records) == 1)
    story.expect_no_text("message list", text, actor=story.agent)


@pytest.mark.parametrize("text", [
    "Do you want me to deploy? The checks passed, so I deployed.",
    "Any failures? No. All checks passed.",
    "What changed? I fixed the totals and checked the result.",
    "What changed?\n- Fixed the totals\n- Checked the tests",
    "?",
])
def test_an_update_that_answers_its_question_passes(new_story, text):
    story = new_story(fixture=UserJoined)
    story.expect_success(f"message send {shlex.quote(text)} --environment main", actor=story.agent)
    story.expect_rows(not any(row.guard == GUARD for row in story.refusals()))


def test_confirm_sends_the_question_and_only_refused_attempts_are_counted(new_story):
    story = new_story(fixture=UserJoined)
    line = 'message send "Do you want the stable version or preview?" --environment main'
    story.expect_refusal(line, "journal question ask", actor=story.agent)
    story.expect_text(f'refusal skip {GUARD} --reason "it asks the person nothing to decide" --environment main', "held", actor=story.agent)
    story.expect_success('refusal confirm 1 --tried "ran the failed tests by name and they pass" --environment main', actor=story.agent)
    story.expect_success(line + ' --confirm --skip-reason "it asks the person nothing to decide"', actor=story.agent)
    story.expect_rows(sum(row.guard == GUARD for row in story.refusals()) == 1)


def test_a_journal_message_is_not_treated_as_a_question_from_the_main_agent(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_success('message send "Do you want the release?" --environment main')
