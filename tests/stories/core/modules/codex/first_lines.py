from tests.stories.core.support.coding_fixtures import CodingEnvironment, BuilderStarted, OpenTaskOrchestrator
from tests.stories.core.modules.codex.support.first_lines import expect_memory_start, expect_read_request, expect_image_read, expect_worker_commands


def test_codex_is_told_how_to_read_the_memory_skill_before_listing_memories(new_story):
    story = new_story(fixture=CodingEnvironment)
    expect_memory_start(story)


def test_requiring_a_skill_prints_its_read_command_and_preserves_json_state(new_story):
    story = new_story(fixture=BuilderStarted)
    expect_read_request(story)


def test_codex_view_image_is_a_read_while_a_skill_blocks_writes(new_story):
    story = new_story(fixture=CodingEnvironment)
    expect_image_read(story)


def test_a_worker_gets_python3_and_repair_guidance_and_can_correct_an_unchecked_proof(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    expect_worker_commands(story)
