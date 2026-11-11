from datetime import timedelta

from core.modules.drivers.models.refusal_skip import RefusalSkip
from tests.stories.core.modules.drivers.support.confirmed_skips import TRIED
from tests.stories.core.support.fixtures import MessageAnswered

GUARD = "messages.one-reply-per-message"
REASON = ' --skip-reason "it adds the result"'


def reply(text: str) -> str:
    return f'message reply 1 "{text}" --environment main'


def kept_skips(story) -> int:
    return len(story.story_rows(RefusalSkip))


def skipped(story) -> None:
    skip_id = story.new_row_id(f'refusal skip {GUARD} --reason "it adds the result" --environment main', actor=story.agent)
    story.expect_success(f'refusal confirm {skip_id} --tried "{TRIED}" --environment main', actor=story.agent)


def refusal_line(story, line: str) -> None:
    story.expect_refusal(line, "already has your reply", actor=story.agent)
    story.advance(timedelta(seconds=1))


def test_a_short_flag_from_an_agent_needs_a_reason(new_story):
    story = new_story(fixture=MessageAnswered)
    refusal_line(story, reply("First without a reason"))
    story.expect_refusal(reply("First without a reason") + " --confirm", "say why this refusal does not apply", actor=story.agent)
    story.expect_rows(kept_skips(story) == 0)


def test_a_skip_from_an_agent_needs_a_refusal_before_it(new_story):
    story = new_story(fixture=MessageAnswered)
    story.expect_refusal(f'refusal skip {GUARD} --reason "it adds the result" --environment main', "has not refused you", actor=story.agent)
    story.expect_rows(kept_skips(story) == 0)


def test_a_short_flag_from_an_agent_spends_only_a_confirmed_skip(new_story):
    story = new_story(fixture=MessageAnswered)
    refusal_line(story, reply("Second unconfirmed"))
    story.expect_refusal(reply("Second unconfirmed") + " --confirm" + REASON, "has no confirmed skip of yours", actor=story.agent)
    story.expect_rows(kept_skips(story) == 0)


def test_a_short_flag_from_an_agent_spends_its_confirmed_skip_and_a_person_needs_no_reason(new_story):
    story = new_story(fixture=MessageAnswered)
    refusal_line(story, reply("Third kept"))
    skipped(story)
    story.expect_success(reply("Third kept") + " --confirm" + REASON, actor=story.agent)
    story.expect_text("refusal-skip show 1", f"name: {GUARD}", "reason: it adds the result", "used_at: ", f"tried: {TRIED}", actor=story.user)
    story.expect_success(reply("Thanks from the person") + " --confirm", actor=story.user)
    story.expect_rows(kept_skips(story) == 1)


def test_a_dry_run_spends_no_skip(new_story):
    story = new_story(fixture=MessageAnswered)
    refusal_line(story, reply("Fourth dry run"))
    story.expect_success(reply("Fourth dry run") + " --confirm" + REASON + " --explain", actor=story.agent)
    story.expect_rows(kept_skips(story) == 0)


def test_the_hint_on_the_skip_guard_path_names_the_flag_that_takes_the_reason(new_story):
    story = new_story(fixture=MessageAnswered)
    refusal_line(story, reply("Fifth hint"))
    story.expect_refusal(reply("Fifth hint") + f" --skip-guard {GUARD}", "--skip-reason '<why>'", actor=story.agent)


def test_a_refusal_by_something_else_between_two_skips_starts_the_count_again(new_story):
    story = new_story(fixture=MessageAnswered)
    refusal_line(story, reply("Seventh obeyed"))
    skipped(story)
    story.expect_success(reply("Seventh obeyed") + " --confirm" + REASON, actor=story.agent)
    story.advance(timedelta(seconds=1))
    story.expect_refusal('question ask "Which way?" --context "A story asks this so its card and answer can be checked." --options "I will fix it" --environment main', "name who acts", actor=story.agent)
    story.advance(timedelta(seconds=1))
    refusal_line(story, reply("Seventh again"))
    skipped(story)
    story.expect_text("refusal-skip show 2", "streak: 1", actor=story.user)
