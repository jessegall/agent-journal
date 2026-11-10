from engine.query.queries import Queries
from core.modules.templates.models.template import Template
from core.testing.expect_row import expect_row
from tests.stories.core.modules.templates.support.template_modules import PATH, REVIEW
from tests.stories.core.support.fixtures import UserJoined


def test_a_module_template_is_stored_with_its_module(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_sync_success(f"{PATH}:ReviewModule")
    story.run_listeners()
    template = next(story.container.get(Queries).query(Template).filter(title=REVIEW.title).all_rows())
    expect_row(template, module="acme.review", brief=REVIEW.brief, targets=REVIEW.targets,
               purpose=REVIEW.purpose, parts=REVIEW.parts, commands=REVIEW.commands)


def test_two_modules_cannot_register_the_same_template_title(new_story):
    story = new_story(f"{PATH}:ReviewModule", fixture=UserJoined)
    story.expect_sync_refusal(f"{PATH}:DuplicateTitleModule",
                             "the modules acme.review and acme.other both register the template Security review")
