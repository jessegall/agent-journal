from tests.stories.core.support.fixtures import AgentStarted


def test_the_recommended_option_is_put_first_and_marked(new_story):
    story = new_story(fixture=AgentStarted)
    story.expect_success('question ask "Which database?" --options sqlite postgres mysql --recommend postgres --environment main',
                         "question 1 asked; waiting for the answer", "1. postgres (recommended)", "2. sqlite", "3. mysql", actor=story.agent)


def test_a_recommendation_that_is_not_an_option_is_refused(new_story):
    story = new_story(fixture=AgentStarted)
    story.expect_refusal('question ask "Which database?" --options sqlite postgres --recommend mysql --environment main',
                         "the recommended choice is not one of the options: mysql", actor=story.agent)


def test_a_question_without_options_is_asked_open_ended(new_story):
    story = new_story(fixture=AgentStarted)
    story.expect_success('question ask "What should the page be called?" --environment main', "question 1 asked; waiting for the answer", actor=story.agent)


def test_a_question_without_an_environment_is_refused(new_story):
    story = new_story(fixture=AgentStarted)
    story.expect_refusal('question ask "Which database?"', "a question needs an environment", actor=story.agent)


def test_the_user_cannot_ask(new_story):
    story = new_story(fixture=AgentStarted)
    story.expect_refusal('question ask "Which database?" --environment main', "nobody can answer a question asked from here", actor=story.user)
