from tests.stories.core.upgrade.support.fixture_upgrade import upgraded_story


def test_a_version_4_agent_moves_with_its_session_program_and_role(new_story):
    story = upgraded_story(new_story)
    listing = story.run("agent list").output_text
    assert "s-1" in listing and "claude" in listing and "main" in listing


def test_the_work_of_an_agent_names_its_new_actor(new_story):
    story = upgraded_story(new_story)
    agent = next(line.split()[0] for line in story.run("agent list").output_text.splitlines() if "s-1" in line)
    story.expect_success("task show 2", f"creator_id: {agent}")


def test_an_agent_with_a_role_version_5_does_not_know_is_skipped_with_its_number_and_reason(new_story):
    story = upgraded_story(new_story)
    assert "skipped agents 2: role ghost-role" in story.upgrade_text and "s-2" not in story.run("agent list").output_text
