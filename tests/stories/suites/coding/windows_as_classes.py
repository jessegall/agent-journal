import ast
import inspect
from pathlib import Path

from engine.database.database import Database
from engine.registry.registry import Registry
from suites.coding.windows.coding_windows import CODING_WINDOWS
from tests.stories.core.support.coding_fixtures import CodingEnvironment
from tests.stories.support.registry_compare import expect_registry_equal, saved_registry


def classes_in(path: str) -> list[str]:
    return [node.name for node in ast.parse(Path(path).read_text()).body if isinstance(node, ast.ClassDef)]


def test_363_each_coding_window_is_a_class_alone_in_its_file_and_the_registry_holds_what_it_declares(new_story):
    story = new_story(fixture=CodingEnvironment)
    registered = {window.name: window for window in Registry.read(story.container.get(Database)).windows}
    single = all(classes_in(inspect.getfile(window)) == [window.__name__] for window in CODING_WINDOWS)
    equal = all((registered[window.name].title, registered[window.name].entry, tuple(registered[window.name].reads)) ==
                (window.declaration().title, window.declaration().entry, tuple(window.declaration().reads)) for window in CODING_WINDOWS)
    story.expect_rows(single, equal, detail=str(sorted(registered)))


def test_364_each_key_of_a_coding_window_is_a_class_alone_in_its_own_file(new_story):
    story = new_story(fixture=CodingEnvironment)
    keys = {key for window in CODING_WINDOWS for key in window.keys}
    story.expect_rows(all(classes_in(inspect.getfile(key)) == [key.__name__] and Path(inspect.getfile(key)).parent.name == "keys" for key in keys), len(keys) == 23)


def test_320_a_sync_after_the_move_leaves_the_registry_equal_window_by_window(new_story):
    story = new_story(fixture=CodingEnvironment)
    saved = saved_registry(story)
    code, output_text = story.synced()
    story.expect_rows(code == 0, detail=output_text)
    expect_registry_equal(story, saved)
