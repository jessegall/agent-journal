from tests.stories.core.upgrade.support.fixture_upgrade import upgraded_story


def test_a_version_4_user_becomes_a_user_actor_named_as_in_version_4(new_story):
    story = upgraded_story(new_story)
    assert "user  Jesse" in story.run("actor list --type user").output_text


def test_the_rows_a_user_made_name_the_new_actor_as_their_creator(new_story):
    story = upgraded_story(new_story)
    creator = next(line.split(": ")[1] for line in story.run("task show 1").output_text.splitlines() if line.startswith("creator_id: "))
    story.expect_success(f"actor show {creator}", "name: Jesse", "type: user")


def test_what_the_system_did_in_version_4_is_the_cores_in_version_5(new_story):
    story = upgraded_story(new_story)
    story.expect_success("environment show 1", "creator_id: 1")
