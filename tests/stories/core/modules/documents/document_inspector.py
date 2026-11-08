from core.base.database.database import Database
from core.base.registry.registry import Registry
from core.modules.documents.models.doc import Doc
from core.modules.documents.models.report import Report
from tests.stories.core.support.fixtures import MainEnvironment
from tests.stories.support.story_checks import expect_value


def declarations(story):
    registry = Registry.read(story.container.get(Database))
    return registry, {entry.declaration.model: entry.declaration for entry in registry.inspectors}


def test_the_document_inspector_is_wide_and_declares_its_body_component(new_story):
    registry, found = declarations(new_story(fixture=MainEnvironment))
    for model in (Doc, Report):
        expect_value((found[model].width.value, [component.window for component in found[model].components], found[model].comments), ("wide", ["documents.document-body"], False))
        expect_value(found[model].links is not None, True)
    window = next(window for window in registry.windows if window.name == "documents.document-body")
    expect_value(window.place, "section")


def test_a_document_not_settled_offers_to_mark_it_as_needing_no_action(new_story):
    registry, found = declarations(new_story(fixture=MainEnvironment))
    action = found[Doc].actions[0]
    expect_value((action.label, action.runs, tuple(action.condition.values), action.condition.field), ("Mark the document as needing no action", "doc settle {row_id} --why={why}", tuple([""]), "close_reason"))


def test_a_settled_document_offers_no_action(new_story):
    registry, found = declarations(new_story(fixture=MainEnvironment))
    buttons = {entry.declaration.name: entry.declaration for entry in registry.buttons}
    expect_value(tuple(buttons["documents.doc-settle"].slots), tuple(["row.doc"]))
    expect_value(tuple(buttons["documents.doc-settle"].condition.values), tuple([""]))


def test_the_report_inspector_runs_report_close(new_story):
    registry, found = declarations(new_story(fixture=MainEnvironment))
    expect_value(found[Report].actions[0].runs, "report close {row_id} --why={why}")
