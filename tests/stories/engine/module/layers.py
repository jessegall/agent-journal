from tests.stories.engine.module.support.layer_project import LayerProject
from tests.stories.core.support.fixtures import MainEnvironment

NOTES_DEPENDENT = "tests.stories.engine.module.support.notes_dependent:NotesDependent"


def test_a_new_module_folder_is_in_a_layer_with_no_configuration_line(new_story, tmp_path):
    story = new_story(fixture=MainEnvironment)
    project = LayerProject(story, tmp_path)
    project.add_module_folder("core.modules.orders", "orders")
    story.expect_rows(project.check(project.declaration("orders", "core.modules.orders")) == [],
                      project.layer_of("src/core/modules/orders/orders_module.py") == "core module orders",
                      not (tmp_path / ".commandments").exists())


def test_a_module_folder_with_no_declaration_class_fails_naming_the_folder_and_what_to_add(new_story, tmp_path):
    story = new_story(fixture=MainEnvironment)
    project = LayerProject(story, tmp_path)
    (tmp_path / "src" / "core" / "modules" / "orders").mkdir(parents=True)
    story.expect_rows(project.check() == ["src/core/modules/orders: has no declaration class"])


def test_a_module_that_lists_a_dependency_that_is_not_installed_is_refused_at_boot_naming_both(new_story):
    story = new_story(fixture=MainEnvironment)
    story.expect_sync_refusal(NOTES_DEPENDENT, "module folder.dependent depends on folder.notes, which is not installed")


def test_the_maintainer_prints_every_layer_with_what_it_may_use_one_line_each(new_story, tmp_path):
    story = new_story(fixture=MainEnvironment)
    lines = LayerProject(story, tmp_path).emitted_layers()
    labels = [line.partition(" may use:")[0] for line in lines]
    story.expect_rows(labels[0] == "engine", len(labels) == len(set(labels)), "core module actors may use: engine" in lines,
                      labels.index("core module tasks") < labels.index("suite coding"),
                      any(line.startswith("suite coding may use: engine, core module actors (public folders)") for line in lines))


def test_a_top_folder_under_src_that_matches_no_layer_pattern_fails_naming_it(new_story, tmp_path):
    story = new_story(fixture=MainEnvironment)
    project = LayerProject(story, tmp_path)
    project.add_file("src/widgets/gadget.py")
    story.expect_rows(project.check() == ["src/widgets/gadget.py: the file is in no layer"],
                      project.layer_of("src/widgets/gadget.py") == "no layer")
