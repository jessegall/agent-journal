from engine.actor.actor import Actor
from engine.enums.command_category import CommandCategory
from tests.stories.core.modules.processes.support.process_samples import install_runner, moved_run
from tests.stories.core.modules.processes.support.reading_scenarios import STEPS, ended_after_a_while, heard
from tests.stories.core.support.coding_fixtures import BuilderStarted, UserBuilder

SPINNER = "\r[###] working" * 1000


def test_an_agent_marks_a_command_unreadable_only_with_a_reason_of_three_words_and_lifts_the_mark(new_story):
    story = new_story(fixture=UserBuilder)
    story.expect_refusal('reader unreadable "make watch" --reason "spinner only"', "at least three words", actor=story.agent)
    story.expect_success('reader unreadable "make  watch" --reason "prints only a spinner"', actor=story.agent)
    story.expect_text("unreadable-mark show 1", "words: make watch", "reason: declared", "note: prints only a spinner", f"creator_id: {story.agent.id}", actor=story.agent)
    story.expect_success('reader readable "make watch"', actor=story.agent)
    story.expect_text("unreadable-mark show 1", f"lifter_id: {story.agent.id}", "lifted_at: ", actor=story.agent)
    story.expect_refusal('reader readable "make watch"', "no command make watch is marked unreadable", actor=story.agent)


def test_two_runs_that_redraw_one_line_mark_their_command_once_and_two_readable_runs_lift_the_mark(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    first = ended_after_a_while(story, moved_run(story, "make spin", CommandCategory.BUILD), SPINNER)
    second = ended_after_a_while(story, moved_run(story, "make spin", CommandCategory.BUILD), SPINNER)
    marked = heard(story)
    story.expect_text("unreadable-mark show 1", "words: make spin", "reason: single line", f"creator_id: {Actor.core().id}", actor=story.agent)
    for _ in range(2):
        ended_after_a_while(story, moved_run(story, "make spin", CommandCategory.BUILD), STEPS)
    lifted = heard(story)
    story.expect_rows(f"output {first.id} is one redrawn line" not in marked, marked.count(f"output {second.id} is one redrawn line") == 1,
                      "command make spin prints readable lines again" in lifted, detail=f"{marked}\n{lifted}")
    story.expect_text("unreadable-mark show 1", "lifted_at: ", actor=story.agent)
