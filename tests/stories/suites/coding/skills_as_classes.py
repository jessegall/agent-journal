import ast
import inspect
from pathlib import Path

from suites.coding.coding_module import CodingModule
from tests.stories.core.support.coding_fixtures import CodingEnvironment
from tests.stories.support.registry_compare import expect_registry_equal, saved_registry


def test_365_each_coding_skill_is_a_class_alone_in_its_file_and_a_sync_offers_the_same_skills(new_story):
    story = new_story(fixture=CodingEnvironment)
    single = all([node.name for node in ast.parse(Path(inspect.getfile(skill)).read_text()).body if isinstance(node, ast.ClassDef)] == [skill.__name__] for skill in CodingModule.skills)
    story.expect_rows(single, all(isinstance(skill, type) for skill in CodingModule.skills))
    saved = saved_registry(story)
    code, output_text = story.synced()
    story.expect_rows(code == 0, detail=output_text)
    expect_registry_equal(story, saved)
