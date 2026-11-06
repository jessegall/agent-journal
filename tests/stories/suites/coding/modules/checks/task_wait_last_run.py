import json

from tests.stories.suites.coding.modules.checks.task_wait_checks import run_due, waiting_story


def test_a_task_inspector_shows_when_its_wait_command_was_last_tried(new_story):
    story = waiting_story(new_story, 'false')
    before = json.loads(story.run('task inspect 1 --json').output_text)
    assert 'not tried yet' in before['openers'][0]
    run_due(story)
    after = json.loads(story.run('task inspect 1 --json').output_text)
    assert 'false passes (last tried ' in after['openers'][0]
