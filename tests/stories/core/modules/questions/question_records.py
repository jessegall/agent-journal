from tests.stories.core.support.fixtures import AgentStarted


def test_the_questions_module_loads_and_an_agent_asks_a_question_open_in_its_environment(new_story):
    story = new_story(fixture=AgentStarted)
    story.expect_success('question ask "Which database?" --context "A story asks this so its card and answer can be checked." --options sqlite postgres --environment main', "question 1 asked; waiting for the answer", "1. sqlite", "2. postgres", actor=story.agent)
    story.expect_success("question show 1", "state: open")


def test_a_title_over_its_limit_is_refused_with_a_line_that_says_where_the_rest_goes(new_story):
    story = new_story(fixture=AgentStarted)
    story.expect_refusal(f'question ask "{"x" * 61}" --context "Some sentences." --environment main', "a question's title is 1 to 60 characters, not 61", actor=story.agent)
    story.expect_refusal(f'question ask "{"x" * 61}" --context "Some sentences." --environment main', "put the rest in --context", actor=story.agent)
    story.expect_success(f'question ask "{"x" * 60}" --context "Some sentences." --environment main', "question 1 asked; waiting for the answer", actor=story.agent)


def test_a_question_without_context_is_refused_with_a_line_that_says_what_to_add(new_story):
    story = new_story(fixture=AgentStarted)
    story.expect_refusal('question ask "Which database?" --environment main', "a question needs its context", actor=story.agent)
    story.expect_refusal('question ask "Which database?" --environment main', "what is being decided, why it came up and what each option means", actor=story.agent)
    story.expect_refusal('question ask "Which database?" --context "   " --environment main', "a question needs its context", actor=story.agent)


def test_the_context_is_kept_and_shown_with_the_question(new_story):
    story = new_story(fixture=AgentStarted)
    story.expect_success('question ask "Which database?" --context "The app needs to store carts. sqlite is a single file." --environment main', actor=story.agent)
    story.expect_text("question show 1", "question 1: Which database?", "context: The app needs to store carts. sqlite is a single file.")
