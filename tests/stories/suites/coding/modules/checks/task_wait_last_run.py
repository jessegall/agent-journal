import json

from tests.stories.suites.coding.modules.checks.task_wait_checks import run_due, waiting_story


def test_a_task_inspector_shows_when_its_wait_command_was_last_tried(new_story):
    story = waiting_story(new_story, 'false')
    initial_inspection = json.loads(story.run('task inspect 1 --json').output_text)
    story.expect_rows('not tried yet' in initial_inspection['openers'][0])
    run_due(story)
    current_inspection = json.loads(story.run('task inspect 1 --json').output_text)
    story.expect_rows('false passes (last tried ' in current_inspection['openers'][0])
