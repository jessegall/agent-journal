from tests.stories.core.support.fixtures import AgentStarted


def test_the_questions_module_loads_and_an_agent_asks_a_question_open_in_its_environment(new_story):
    story = new_story(fixture=AgentStarted)
    story.expect_success('question ask "Which database?" --options sqlite postgres --environment main', "question 1 asked; waiting for the answer", "1. sqlite", "2. postgres", actor=story.agent)
    story.expect_success("question show 1", "state: open", f"agent_id: {story.agent.id}", "environment_id: 1")


def test_a_question_text_over_its_limit_is_refused(new_story):
    story = new_story(fixture=AgentStarted)
    story.expect_refusal(f'question ask "{"x" * 501}" --environment main', "a question's text is 1 to 500 characters, not 501", actor=story.agent)
