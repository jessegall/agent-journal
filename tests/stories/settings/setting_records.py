from tests.stories.tasks.task_lifecycle import started_story


def test_one_key_is_set_for_the_project_and_for_an_environment(story_on):
    story = started_story(story_on)
    story.expect_success('setting make workers.mode \'"builder"\'', "key: workers.mode", 'value: "builder"')
    story.expect_success('setting make workers.mode \'"solo"\' --environment main', "environment_id: 1", 'value: "solo"')


def test_a_second_project_setting_with_the_same_key_is_refused(story_on):
    story = started_story(story_on)
    story.run('setting make workers.mode \'"builder"\'')
    story.expect_refusal('setting make workers.mode \'"solo"\'', "a setting with that key exists already")


def test_a_value_that_is_not_json_is_refused(story_on):
    story = started_story(story_on)
    story.expect_refusal("setting make workers.mode builder", "a setting must keep to json_valid(value)")
