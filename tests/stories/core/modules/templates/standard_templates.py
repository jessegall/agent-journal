from engine.query.queries import Queries
from core.modules.templates.models.template import Template
from engine.testing.expectations.expect_row import expect_row
from server.booting_work import BootingWork
from tests.stories.core.modules.templates.support.legacy_templates import LegacyTemplates, TEMPLATE_MODULES
from tests.stories.core.support.fixtures import UserJoined

EXPECTED_MODULES = {"General critique": "journal.core.templates", **TEMPLATE_MODULES}


def test_the_thirteen_standard_templates_are_registered_by_their_modules(new_story):
    story = new_story(fixture=UserJoined)
    BootingWork().run(story.container)
    story.run_listeners()
    rows = tuple(story.container.get(Queries).query(Template).all_rows())
    story.expect_rows(len(rows) == 13, {row.title for row in rows} == set(EXPECTED_MODULES))
    story.expect_text("template list", *EXPECTED_MODULES, actor=story.user)
    for row in rows:
        expect_row(row, module=EXPECTED_MODULES[row.title])
    expect_row(next(row for row in rows if row.title == "General critique"), targets=tuple(["plan"]),
               purpose="critique", brief="Read it as a whole and say what you would change, and why.")


def test_upgrading_standard_templates_keeps_the_rows_and_fills_the_module(new_story):
    story = new_story(fixture=LegacyTemplates)
    old_ids = {row.title: row.id for row in story.container.get(Queries).query(Template).all_rows()}
    BootingWork().run(story.container)
    story.run_listeners()
    rows = tuple(story.container.get(Queries).query(Template).all_rows())
    story.expect_rows({row.title: row.id for row in rows if row.title in old_ids} == old_ids, len(rows) == 13)
    for row in rows:
        expect_row(row, module=EXPECTED_MODULES[row.title])
