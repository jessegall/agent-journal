from tests.stories.core.modules.questions.fixtures import OpenQuestion
from tests.stories.support.story_checks import expect_count_output_2


def test_an_open_question_docks_from_its_inspector(new_story):
    story = new_story(fixture=OpenQuestion)
    story.expect_success("dock add questions.question question 1 --environment main", "type: questions.question", actor=story.user)


def test_a_question_docks_once(new_story):
    story = new_story(fixture=OpenQuestion)
    story.run("dock add questions.question question 1 --environment main", actor=story.user)
    story.expect_refusal("dock add questions.question question 1 --environment main", "is docked already", actor=story.user)


def test_while_questions_are_open_one_card_waits_above_the_chat_and_it_leaves_with_the_last(new_story):
    story = new_story(fixture=OpenQuestion)
    story.run_listeners()
    story.expect_text("dock-item list", "questions.open")
    story.run('question ask "And the cache?" --context "A story asks this so its card and answer can be checked." --environment main', actor=story.agent)
    story.run_listeners()
    expect_count_output_2(story, "dock-item list", "questions.open", 1)
    story.run('question answer 1 --answer sqlite', actor=story.user)
    story.run_listeners()
    expect_count_output_2(story, "dock-item list", "questions.open", 1)
    story.run('question answer 2 --answer yes', actor=story.user)
    story.run_listeners()
    story.expect_absent("dock-item list --state docked", "questions.open")
