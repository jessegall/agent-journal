from engine.database.database import Database
from engine.registry.registry import Registry
from core.modules.documents.models.doc import Doc
from core.modules.documents.models.report import Report
from tests.stories.core.support.fixtures import MainEnvironment
from tests.stories.support.story_checks import expect_value


def declarations(story):
    registry = Registry.read(story.container.get(Database))
    return registry, {entry.declaration.model: entry.declaration for entry in registry.inspectors}


def test_the_document_inspector_is_wide_and_declares_its_body_component(new_story):
    registry, matched = declarations(new_story(fixture=MainEnvironment))
    for model in (Doc, Report):
        expect_value((matched[model].width.value, [component.window for component in matched[model].components], matched[model].comments), ("wide", ["documents.document-body"], False))
        expect_value(matched[model].links, None)
    window = next(window for window in registry.windows if window.name == "documents.document-body")
    expect_value(window.place, "section")


def test_settling_and_editing_are_in_the_body_menu_so_the_inspector_declares_no_action(new_story):
    registry, matched = declarations(new_story(fixture=MainEnvironment))
    for model in (Doc, Report):
        expect_value(tuple(matched[model].actions), ())


def test_the_body_window_runs_settle_for_a_document_and_close_for_a_report(new_story):
    registry, matched = declarations(new_story(fixture=MainEnvironment))
    window = next(window for window in registry.windows if window.name == "documents.document-body")
    expect_value(("doc settle" in window.runs, "report close" in window.runs, "link list" in window.reads), (True, True, True))
