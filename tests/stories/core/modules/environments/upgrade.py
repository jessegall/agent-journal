from tests.stories.core.base.upgrade.support.fixture_upgrade import upgraded_story


def test_an_environment_moves_with_its_number_name_and_branch_and_the_project_as_its_folder(new_story):
    story = upgraded_story(new_story)
    story.expect_success("environment show 1", "name: main", "branch: development", f"folder: {story.home.project_folder}")


def test_the_environments_key_of_version_4_is_not_carried(new_story):
    story = upgraded_story(new_story)
    assert "key-main" not in story.run("environment show 1").output_text
