import io
import shutil
from pathlib import Path
from uuid import uuid4

import pytest

from core.base.caller.caller_request import CallerRequest
from core.base.cli.line_run import LineRun
from core.base.query.queries import Queries
from core.modules.templates.models.template import Template
from tests.stories.core.modules.drivers.support.module_memberships import PATH
from tests.stories.core.modules.drivers.support.extended_suites import PATH as EXTENDED_SUITES
from tests.stories.core.modules.viewer.support.window_story import WindowStory
from tests.stories.core.support.fixtures import UserJoined


@pytest.fixture
def installed_review(new_story, tmp_path):
    story = new_story(f"{PATH}:SuiteModule", fixture=UserJoined)
    source = Path(__file__).parent / "support" / "acme_review"
    folder = tmp_path / f"acme_review_{uuid4().hex}"
    shutil.copytree(source, folder)
    stream = io.StringIO()
    code = LineRun(story.home).run(["module", "add", str(folder)], CallerRequest({}, str(tmp_path), 0), stream)
    story.expect_rows(code == 0)
    code, text = story.synced()
    story.expect_rows(code == 0)
    story.run_listeners()
    story.expect_success("suite choose coding --environment main", actor=story.user)
    story.expect_success("environment make elsewhere /work/elsewhere")
    story.expect_success("suite choose acme --environment elsewhere", actor=story.user)
    return story


def template_id(story):
    return story.container.get(Queries).query(Template).filter(title="Security review").page(1, 1).rows[0].id


@pytest.mark.parametrize("environment", ["main", None])
def test_a_coding_module_template_is_visible_in_coding_and_without_an_environment(installed_review, environment):
    options = f" --environment {environment}" if environment is not None else ""
    installed_review.expect_text("template list" + options, "Security review")
    installed_review.expect_text(f"template show {template_id(installed_review)}" + options, "Security review")
    installed_review.expect_text("window search templates.templates Security" + options, "Security review")


def test_an_inactive_template_is_absent_from_list_show_and_window_search(installed_review):
    installed_review.expect_success("template list --environment elsewhere")
    installed_review.expect_no_text("template list --environment elsewhere", "Security review")
    installed_review.expect_refusal(f"template show {template_id(installed_review)} --environment elsewhere", "no template")
    installed_review.expect_success("window search templates.templates Security --environment elsewhere")
    installed_review.expect_no_text("window search templates.templates Security --environment elsewhere", "Security review")


def test_the_templates_window_reads_only_active_templates(installed_review):
    window = WindowStory(installed_review)
    window.expect_window_allowed("templates.templates", "template list", environment="elsewhere")
    request = CallerRequest({}, "/work/elsewhere", 0)
    outcome = installed_review.run_requested("template list --json", request)
    installed_review.expect_rows(outcome.code == 0, "Security review" not in outcome.output_text, "General critique" in outcome.output_text)


def test_journal_search_keeps_inactive_template_rows(installed_review):
    installed_review.expect_text('search find "Security review"', "Security review")


def test_a_persons_template_stays_visible_in_every_suite(installed_review):
    installed_review.expect_success('template make "My review" --brief Personal', actor=installed_review.user)
    installed_review.expect_text("template list --environment elsewhere", "My review", "General critique")


def test_a_suite_that_requires_coding_gets_the_coding_modules_templates(installed_review):
    installed_review.expect_sync_success(f"{EXTENDED_SUITES}:AuditModule")
    installed_review.expect_success("suite choose audit --environment elsewhere", actor=installed_review.user)
    installed_review.expect_text("template list --environment elsewhere", "Security review")
    installed_review.expect_text("window search templates.templates Security --environment elsewhere", "Security review")
