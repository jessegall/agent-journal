from tests.stories.core import story_lines as lines
def test_an_environment_is_made_with_its_folder_and_branch_and_its_maker(new_story):
    story = new_story()
    story.expect_success('environment make main /work/journal --branch version-5', "name: main", "folder: /work/journal", "branch: version-5", "creator_id: 1")


def test_a_second_environment_with_the_same_name_is_refused(new_story):
    story = new_story()
    story.run(lines.NEW_ENVIRONMENT)
    story.expect_refusal("environment make main /elsewhere", "an environment with that name exists already")


def test_the_branch_of_an_environment_is_edited_alone(new_story):
    story = new_story()
    story.run("environment make main /work/journal --branch main")
    story.expect_success("environment edit 1 --branch version-5", "branch: version-5", "folder: /work/journal", "version: 2")


def test_a_write_names_its_environment_by_name_and_an_unknown_name_is_refused(new_story):
    story = new_story()
    story.run(lines.NEW_ENVIRONMENT)
    story.expect_success('actor make user "Ada" --environment main', "name: Ada")
    story.expect_refusal('actor make user "Grace" --environment elsewhere', "no environment named elsewhere")
