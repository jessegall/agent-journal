import shlex

from engine.actor.actor import Actor
from core.base.query.queries import Queries
from core.modules.templates.models.template import Template
from core.testing.story_fixture import StoryFixture
from tests.stories.core.support.fixtures import UserJoined

CODING_TITLES = ("Functional design", "Find what is wrong", "Find what is missing", "Challenge the approach",
                 "Never run tests", "Tests at the end of each phase", "Scoped tests after each task", "Test throughout")
WORKER_TITLES = ("No tests", "The journal tests", "Scoped tests", "Full suite")
TEMPLATE_MODULES = {**dict.fromkeys(CODING_TITLES, "journal.suites.coding"),
                    **dict.fromkeys(WORKER_TITLES, "journal.suites.coding.workers")}


class LegacyTemplates(StoryFixture):
    """The twelve standard templates have their old rows without module names."""

    parent = UserJoined

    def steps(self, story):
        for title in TEMPLATE_MODULES:
            story.run(f"template make {shlex.quote(title)} --brief 'old version'", actor=Actor.core())

    def expect(self, story):
        rows = tuple(story.container.get(Queries).query(Template).all_rows())
        story.expect_rows(len(rows) == 12, all(row.module == "" for row in rows))
