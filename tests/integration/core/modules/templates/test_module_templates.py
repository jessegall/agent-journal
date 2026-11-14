from core.modules.templates.models.template import Template
from engine.listener.commit.commit_listener_runner import CommitListenerRunner
from engine.query.queries import Queries
from tests.stories.core.modules.templates.support.template_modules import PATH, REVIEW


def test_a_module_template_is_stored_with_its_module(journal):
    journal.expect_sync_success(f"{PATH}:ReviewModule")
    journal.container.get(CommitListenerRunner).run()
    template = next(journal.container.get(Queries).query(Template).filter(title=REVIEW.title).every_row("the test reads every template it checks"))
    assert (template.module, template.brief, template.targets, template.purpose, template.parts, template.commands) == \
        ("acme.review", REVIEW.brief, REVIEW.targets, REVIEW.purpose, REVIEW.parts, REVIEW.commands)


def test_two_modules_cannot_register_the_same_template_title(journal_with):
    journal = journal_with(f"{PATH}:ReviewModule")
    journal.expect_sync_refusal(f"{PATH}:DuplicateTitleModule", "the modules acme.review and acme.other both register the template Security review")
