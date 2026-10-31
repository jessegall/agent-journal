def test_an_environment_is_made_with_its_folder_and_branch_and_its_maker(story_on):
    story = story_on()
    story.expect_success('environment make main /work/journal --branch version-5', "name: main", "folder: /work/journal", "branch: version-5", "creator_id: 1")


def test_a_second_environment_with_the_same_name_is_refused(story_on):
    story = story_on()
    story.run("environment make main /work/journal")
    story.expect_refusal("environment make main /elsewhere", "an environment with that name exists already")


def test_the_branch_of_an_environment_is_edited_alone(story_on):
    story = story_on()
    story.run("environment make main /work/journal --branch main")
    story.expect_success("environment edit 1 --branch version-5", "branch: version-5", "folder: /work/journal", "version: 2")


def test_a_write_names_its_environment_by_name_and_an_unknown_name_is_refused(story_on):
    story = story_on()
    story.run("environment make main /work/journal")
    story.expect_success('actor make user "Ada" --environment main', "name: Ada")
    story.expect_refusal('actor make user "Grace" --environment elsewhere', "no environment named elsewhere")
