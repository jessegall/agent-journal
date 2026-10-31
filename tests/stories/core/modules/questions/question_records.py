from tests.stories.core.support.fixtures import AgentStarted


def test_the_questions_module_loads_and_a_question_is_made_open_with_its_options(new_story):
    story = new_story(fixture=AgentStarted)
    story.expect_success(f'question make {story.agent.id} "Which database?" --options sqlite postgres --recommended sqlite --environment main',
                         "state: open", "recommended: sqlite")


def test_a_question_text_over_its_limit_is_refused(new_story):
    story = new_story(fixture=AgentStarted)
    story.expect_refusal(f'question make {story.agent.id} "{"x" * 501}" --environment main', "a question's text is 1 to 500 characters, not 501")
