from tests.stories.engine.module.support.layer_project import LayerProject

ASSIGNMENT = "src/core/modules/assignments/models/assignment.py"
TASK_ASSIGNMENTS = "src/core/modules/tasks/support/task_assignments.py"
ASSIGNMENT_SUBJECTS = "src/core/modules/assignments/support/assignment_subjects.py"


def test_589_a_new_module_is_in_a_layer_once_it_declares_itself_and_the_modules_that_adopt_it_list_it(new_story, tmp_path):
    story = new_story()
    project = LayerProject(story, tmp_path)
    project.add_file(ASSIGNMENT)
    project.add_module_folder("core.modules.tasks", "tasks")
    project.add_file(TASK_ASSIGNMENTS, "from core.modules.assignments.models.assignment import Assignment\n")
    assignments = project.declaration("assignments", "core.modules.assignments")
    undeclared = project.check(project.declaration("tasks", "core.modules.tasks", "assignments"))
    unlisted = project.check(assignments, project.declaration("tasks", "core.modules.tasks"))
    listed = project.check(assignments, project.declaration("tasks", "core.modules.tasks", "assignments"))
    story.expect_rows("src/core/modules/assignments: has no declaration class" in undeclared, detail=str(undeclared))
    story.expect_rows(unlisted == [f"{TASK_ASSIGNMENTS} imports core module assignments, which core module tasks may not use"], listed == [], detail=f"{unlisted} {listed}")


def test_589_a_new_module_that_imports_a_module_adopting_it_is_refused_naming_its_file(new_story, tmp_path):
    story = new_story()
    project = LayerProject(story, tmp_path)
    project.add_module_folder("core.modules.assignments", "assignments")
    project.add_module_folder("core.modules.tasks", "tasks")
    project.add_file("src/core/modules/tasks/models/task.py")
    project.add_file(ASSIGNMENT_SUBJECTS, "from core.modules.tasks.models.task import Task\n")
    failures = project.check(project.declaration("assignments", "core.modules.assignments"), project.declaration("tasks", "core.modules.tasks", "assignments"))
    story.expect_rows(f"{ASSIGNMENT_SUBJECTS} imports core module tasks, which core module assignments may not use" in failures, project.layer_of(ASSIGNMENT_SUBJECTS) == "core module assignments", detail=str(failures))
