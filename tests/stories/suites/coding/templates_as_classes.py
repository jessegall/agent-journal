from core.modules.templates.templates_module import TemplatesModule
from suites.coding.coding_module import CodingModule
from tests.stories.core.support.coding_fixtures import CodingEnvironment
from tests.stories.support.registry_compare import expect_registry_equal, saved_registry


def test_368_the_template_lists_hold_classes_and_a_sync_registers_the_same_templates(new_story):
    story = new_story(fixture=CodingEnvironment)
    story.expect_rows(all(isinstance(template, type) for module in (CodingModule, TemplatesModule) for template in module.templates))
    saved = saved_registry(story)
    code, output_text = story.synced()
    story.expect_rows(code == 0, detail=output_text)
    expect_registry_equal(story, saved)
