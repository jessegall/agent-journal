from tests.stories.core.modules.processes.support.process_samples import start_process
from tests.stories.core.support.coding_fixtures import BuilderStarted


def test_the_feed_brings_a_process_with_only_its_line_and_state(new_story):
    story = new_story(fixture=BuilderStarted)
    start_process(story)
    answer = story.run("process feed --json", actor=story.user).output_text
    assert '"line"' in answer and '"state": "running"' in answer
    assert '"folder"' not in answer and '"shell"' not in answer and '"pid"' not in answer


def test_the_feed_brings_one_process_by_its_number(new_story):
    story = new_story(fixture=BuilderStarted)
    start_process(story)
    assert '"id": 1' in story.run("process feed --id 1 --json", actor=story.user).output_text
    assert '"rows": []' in story.run("process feed --id 9 --json", actor=story.user).output_text
