import json

from engine.driver.command_category import CommandCategory
from tests.stories.core.modules.processes.support.process_samples import moved_run
from tests.stories.core.support.coding_fixtures import UserBuilder


def test_a_run_with_no_reader_says_so_and_names_the_agent_that_ran_it(new_story):
    story = new_story(fixture=UserBuilder)
    process = moved_run(story, "make package", category=CommandCategory.BUILD)
    card = json.loads(story.run(f"process card {process.id} --json", actor=story.agent).output_text)
    story.expect_rows(card["reads_progress"] is False, card["agent_id"] == story.agent.id)
