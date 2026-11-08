from tests.stories.core.support.coding_fixtures import BuilderStarted

AGENTS_SHOWN = 25


def test_the_agents_window_reads_25_agents_without_reading_any_one_of_them_twice(new_story):
    story = new_story(fixture=BuilderStarted)
    for number in range(AGENTS_SHOWN):
        story.expect_success(f"agent start s-{number + 10} claude helper --parent {story.agent.id} --environment main")
    shown = story.run("agent cards --show all --limit 25 --include-main --json", actor=story.agent)
    story.expect_rows(shown.code == 0, detail=shown.output_text)
    story.expect_rows(shown.output_text.count('"session": "s-') >= AGENTS_SHOWN - 1, detail=shown.output_text[:300])
