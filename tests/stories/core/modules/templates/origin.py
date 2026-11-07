import pytest

from core.base.query.queries import Queries
from core.modules.templates.models.template import Template
from tests.stories.core.modules.templates.support.active_template_fixture import installed_review


@pytest.fixture
def template_story(installed_review):
    installed_review.expect_success('template make "Security review" --brief Personal', actor=installed_review.user)
    return installed_review


@pytest.mark.parametrize("module, origin", [("acme.review", "Module: acme.review"), ("", "Written by a person")])
@pytest.mark.parametrize("command", ["list", "show"])
def test_templates_with_the_same_title_name_their_origin(template_story, module, origin, command):
    story = template_story
    template = story.container.get(Queries).query(Template).filter(title="Security review", module=module).page(1, 1).rows[0]
    line = "template list" if command == "list" else f"template show {template.id}"
    story.expect_text(line, f"Security review (for {'plan, critique' if module else 'any'}) · {origin}", actor=story.user)
