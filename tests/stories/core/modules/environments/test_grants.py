from tests.stories.core.support.coding_fixtures import BuilderStarted

FAKE_START = "agent start s-9 claude main --environment story-engine"


def test_an_agent_starts_no_fake_agent_in_another_environment_until_a_person_grants_it(new_story):
    story = new_story(fixture=BuilderStarted)
    story.expect_success("environment make story-engine /work/story-engine", actor=story.user)
    story.expect_success("environment make elsewhere /work/elsewhere", actor=story.user)
    story.expect_refusal(FAKE_START, f"agent {story.agent.id} works only in its own environment", actor=story.agent)
    story.expect_success(f"environment edit 2 --test --test-agent-id {story.agent.id}", "test: True", actor=story.user)
    story.expect_success(FAKE_START, "role: main", "environment_id: 2", actor=story.agent)
    story.expect_refusal("agent start s-10 claude main --environment elsewhere", "works only in its own environment", actor=story.agent)


def test_an_agent_cannot_grant_itself_a_test_environment(new_story):
    story = new_story(fixture=BuilderStarted)
    story.expect_success("environment make story-engine /work/story-engine --test", actor=story.user)
    story.expect_refusal(f"environment edit 2 --test-agent-id {story.agent.id} --reason 'a story asks'", f"Let agent {story.agent.id} work in test environment story-engine?",
                         actor=story.agent)


def test_only_a_test_environment_takes_a_grant(new_story):
    story = new_story(fixture=BuilderStarted)
    story.expect_success("environment make story-engine /work/story-engine", actor=story.user)
    story.expect_refusal(f"environment edit 2 --test-agent-id {story.agent.id}", "is not a test environment, so it takes no grant", actor=story.user)


def test_the_granted_agent_may_dispatch_a_worker_with_no_program_in_its_test_environment_only(new_story):
    story = new_story(fixture=BuilderStarted)
    story.expect_success(f"environment make story-engine /work/story-engine --test --test-agent-id {story.agent.id}", actor=story.user)
    story.expect_success('task make "Real work" --brief "Work of the agent itself" --environment main', actor=story.user)
    story.expect_success('task make "Fake work" --brief "A fake agent works it" --environment story-engine', actor=story.user)
    story.expect_refusal("worker dispatch 1 --no-program --environment main", "only a person dispatches a worker with no program", actor=story.agent)
    outcome = story.run("worker dispatch 2 --no-program --environment story-engine", actor=story.agent)
    assert "only a person dispatches a worker with no program" not in outcome.output_text, outcome.output_text
