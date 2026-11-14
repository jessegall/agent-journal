import shlex

from core.modules.templates.models.template import Template
from engine.query.queries import Queries
from engine.listener.commit.commit_listener_runner import CommitListenerRunner
from server.work.booting_work import BootingWork

CODING_TITLES = ("Functional design", "Find what is wrong", "Find what is missing", "Challenge the approach",
                 "Never run tests", "Tests at the end of each phase", "Scoped tests after each task", "Test throughout")
WORKER_TITLES = ("No tests", "The journal tests", "Scoped tests", "Full suite")
EXPECTED_MODULES = {"General critique": "journal.core.templates", **dict.fromkeys(CODING_TITLES, "journal.suites.coding"),
                    **dict.fromkeys(WORKER_TITLES, "journal.suites.coding.workers")}


def stored_templates(journal) -> list[Template]:
    return list(journal.container.get(Queries).query(Template).every_row("the test reads every template it checks"))


def booted_templates(journal) -> list[Template]:
    BootingWork().run(journal.container)
    journal.container.get(CommitListenerRunner).run()
    return stored_templates(journal)


def test_the_thirteen_standard_templates_are_registered_by_their_modules(journal):
    rows = booted_templates(journal)
    assert {row.title: row.module for row in rows} == EXPECTED_MODULES
    critique = next(row for row in rows if row.title == "General critique")
    assert (critique.purpose, critique.brief) == ("critique", "Read it as a whole and say what you would change, and why.")


def test_upgrading_standard_templates_keeps_the_rows_and_fills_the_module(journal):
    for title in [*CODING_TITLES, *WORKER_TITLES]:
        made = journal.run(f"template make {shlex.quote(title)} --brief 'old version'")
        assert made.code == 0, made.text
    old_ids = {row.title: row.id for row in stored_templates(journal)}
    rows = booted_templates(journal)
    assert {row.title: row.id for row in rows if row.title in old_ids} == old_ids and len(rows) == 13
    assert {row.title: row.module for row in rows} == EXPECTED_MODULES
