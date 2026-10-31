from tests.stories.core.support.fixtures import AgentStarted


def test_an_option_that_says_i_or_you_is_refused_and_listed(new_story):
    story = new_story(fixture=AgentStarted)
    story.expect_refusal('question ask "Which way?" --options "I will fix it" "The agent fixes it" "you decide" --environment main',
                         "an option states who acts by name, never I, we or you: I will fix it; you decide", actor=story.agent)


def test_the_refusal_names_the_way_out(new_story):
    story = new_story(fixture=AgentStarted)
    story.expect_refusal('question ask "Which way?" --options "We ship it" --environment main', "name who acts: the agent or the user", actor=story.agent)


def test_options_that_name_the_agent_or_the_user_pass(new_story):
    story = new_story(fixture=AgentStarted)
    story.expect_success('question ask "Which way?" --options "The agent fixes it" "The user decides" --environment main', "question 1 asked; waiting for the answer", actor=story.agent)


def test_waive_skips_the_guard(new_story):
    story = new_story(fixture=AgentStarted)
    story.expect_success('question ask "Which way?" --options "I will fix it" --waive --environment main', "question 1 asked; waiting for the answer", actor=story.agent)
