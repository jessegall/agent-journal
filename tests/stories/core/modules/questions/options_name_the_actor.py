from tests.stories.core.support.fixtures import AgentStarted


def test_waive_with_a_reason_skips_the_guard_after_a_refusal(new_story):
    story = new_story(fixture=AgentStarted)
    story.expect_refusal('question ask "Which way?" --context "A story asks this so its card and answer can be checked." --options "I will fix it" --environment main', "name who acts", actor=story.agent)
    story.expect_text('refusal skip questions.options-name-the-actor --reason "the option quotes a name" --environment main', "held", actor=story.agent)
    story.expect_success('refusal confirm 1 --tried "ran the failed tests by name and they pass" --environment main', actor=story.agent)
    story.expect_success('question ask "Which way?" --context "A story asks this so its card and answer can be checked." --options "I will fix it" --waive --skip-reason "the option quotes a name" --environment main', "question 1 asked; waiting for the answer", actor=story.agent)
