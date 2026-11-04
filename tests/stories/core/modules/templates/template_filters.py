import pytest

from tests.stories.core.modules.templates.support.filter_templates import FilterTemplates


@pytest.mark.parametrize("options,included,excluded", [
    ("--target plan", ("Plan critique", "Plan testing", "Any critique"), tuple(["Doc critique"])),
    ("--purpose critique", ("Plan critique", "Doc critique", "Any critique"), tuple(["Plan testing"])),
    ("--target plan --purpose critique", ("Plan critique", "Any critique"), ("Doc critique", "Plan testing")),
    ("--target plan --purpose testing", tuple(["Plan testing"]), ("Plan critique", "Doc critique", "Any critique")),
    ("--target anything", tuple(["Any critique"]), ("Plan critique", "Doc critique", "Plan testing")),
    ("--target pla", tuple(["Any critique"]), ("Plan critique", "Doc critique", "Plan testing")),
])
def test_template_list_filters_targets_and_purposes(new_story, options, included, excluded):
    story = new_story(fixture=FilterTemplates)
    story.expect_text(f"template list {options}", *included, actor=story.user)
    story.expect_no_text(f"template list {options}", *excluded, actor=story.user)
