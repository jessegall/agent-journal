from core.base.query.queries import Queries
from core.modules.templates.models.template import Template
from core.testing.expect_row import expect_row
from server.booting_work import BootingWork
from tests.stories.core.modules.templates.support.legacy_templates import LegacyTemplates, TEMPLATE_MODULES
from tests.stories.core.support.fixtures import UserJoined


def test_the_original_twelve_templates_are_registered_by_their_modules(new_story):
    story = new_story(fixture=UserJoined)
    BootingWork().run(story.container)
    story.run_listeners()
    rows = tuple(story.container.get(Queries).query(Template).all_rows())
    story.expect_rows(len(rows) == 12, {row.title for row in rows} == set(TEMPLATE_MODULES))
    story.expect_text("template list", *TEMPLATE_MODULES, actor=story.user)
    for row in rows:
        expect_row(row, module=TEMPLATE_MODULES[row.title])


def test_upgrading_standard_templates_keeps_the_rows_and_fills_the_module(new_story):
    story = new_story(fixture=LegacyTemplates)
    old_ids = {row.title: row.id for row in story.container.get(Queries).query(Template).all_rows()}
    BootingWork().run(story.container)
    story.run_listeners()
    rows = tuple(story.container.get(Queries).query(Template).all_rows())
    story.expect_rows({row.title: row.id for row in rows} == old_ids)
    for row in rows:
        expect_row(row, module=TEMPLATE_MODULES[row.title])
