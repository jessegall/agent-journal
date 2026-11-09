from tests.stories.core.modules.plugins.services import served_story
from tests.stories.core.support.scanned_edits import scanned_edit

TOTAL_ROWS = [{"line_type": "add", "line": 1, "text": "total = 0"}]


def test_an_agent_that_lives_through_a_disable_and_an_enable_has_its_next_edit_asked_of_the_service(new_story):
    story = served_story(new_story)
    try:
        scanned_edit(story, "s-1", "a.py")
        story.run_listeners()
        story.run("plugin disable served", actor=story.user)
        story.services.follow(story.processes)
        story.run("plugin enable served", actor=story.user)
        story.services.follow(story.processes)
        scanned_edit(story, "s-1", "b.py")
        story.run_listeners()
        service_lines = (story.home.folder / "plugin-data" / "served" / "asked").read_text()
        story.expect_rows('"path": "a.py"' in service_lines, '"path": "b.py"' in service_lines, detail=service_lines)
    finally:
        story.processes.close()
