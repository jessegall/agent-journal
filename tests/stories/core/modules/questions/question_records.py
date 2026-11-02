from tests.stories.core.support.fixtures import AgentStarted


def test_the_questions_module_loads_and_an_agent_asks_a_question_open_in_its_environment(new_story):
    story = new_story(fixture=AgentStarted)
    story.expect_success('question ask "Which database?" --options sqlite postgres --environment main', "question 1 asked; waiting for the answer", "1. sqlite", "2. postgres", actor=story.agent)
    story.expect_success("question show 1", "state: open")


def test_a_question_text_over_its_limit_is_refused(new_story):
    story = new_story(fixture=AgentStarted)
    story.expect_refusal(f'question ask "{"x" * 501}" --environment main', "a question's text is 1 to 500 characters, not 501", actor=story.agent)


def test_an_option_over_its_limit_or_empty_is_refused_when_asked(new_story):
    story = new_story(fixture=AgentStarted)
    story.expect_refusal(f'question ask "Which?" --options "{"x" * 121}" --environment main', "a question's option is 1 to 120 characters, not 121", actor=story.agent)
    story.expect_refusal('question ask "Which?" --options "" --environment main', "a question's option is 1 to 120 characters, not 0", actor=story.agent)


def test_a_recommended_choice_outside_the_options_is_refused_when_asked(new_story):
    story = new_story(fixture=AgentStarted)
    story.expect_refusal('question ask "Which?" --options one two --recommend three --environment main', "the recommended choice is not one of the options", actor=story.agent)
