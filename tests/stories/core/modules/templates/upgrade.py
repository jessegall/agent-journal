from tests.stories.engine.upgrade.support.fixture_upgrade import upgraded_story, expect_upgrade_text


def test_a_version_4_template_keeps_its_brief_targets_purpose_and_parts(new_story):
    story = upgraded_story(new_story)
    story.expect_ordered_lines("template show 1", "template 1: Find what is missing (for plan, critique) · Written by a person", "Read the plan against its goal", "- Gaps")
    expect_upgrade_text(story, "journal.core.templates: moved 1")
