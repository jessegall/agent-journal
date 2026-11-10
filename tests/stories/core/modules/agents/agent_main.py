from engine.testing.examples.hook_samples import HookSamples
from tests.stories.core.support.scanned_edits import scanned_edit
from tests.stories.core.support.coding_fixtures import BuilderStarted


def test_the_main_agent_is_the_running_one_though_a_newer_one_has_ended(new_story):
    story = new_story(fixture=BuilderStarted)
    newer = story.new_row_id("agent start s-2 claude main --environment main")
    story.expect_success(f"agent end {newer}")
    story.expect_success("agent start s-1 claude main --environment main")
    story.expect_success("agent main --environment main", f"agent {story.agent.id}")


def test_with_none_running_it_says_so(new_story):
    story = new_story(fixture=BuilderStarted)
    story.expect_success(f"agent end {story.agent.id}")
    story.expect_success("agent main --environment main", "no main agent is running")


def test_an_edit_shows_in_the_file_list_of_the_agent_the_home_page_reads(new_story):
    story = new_story(fixture=BuilderStarted)
    scanned_edit(story, "s-1", "src/cart.py")
    story.run_listeners()
    running = story.run("agent main --environment main").output_text.split()[1]
    story.expect_text(f"file-edit list --agent {running}", "src/cart.py")
