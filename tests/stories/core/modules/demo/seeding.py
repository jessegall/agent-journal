import pytest

from tests.stories.core.modules.demo.support.demo_fixtures import Demonstrated

# what each module's seeder leaves, read the way the module's own window reads it: the line, and the words it shows
SHOWN = {
    "actors": ("actor list", "Demo"),
    "environments": ("environment list", "demo"),
    "agents": ("agent list", "demo-main", "demo-worker"),
    "tasks": ("task list --oldest", "open", "started", "blocked", "completed", "cancelled"),
    "task logs": ("task-log list", "Found the cart total in cents"),
    "plans": ("plan list", "Version 5 demo"),
    "phases": ("phase list --plan 1 --oldest", "Values", "Checkout"),
    "messages": ("message list --oldest", "Fix the cart total first", "On it"),
    "questions open": ("question list", "Which database?"),
    "questions answered": ("question show 2", "state: answered", "answer: Cart"),
    "memories": ("memory list", "fact", "rule", "reminder"),
    "reviews": ("review list", "task"),
    "review steps": ("review-step list --review 1 --oldest", "Started reviewing task"),
    "docked items": ("dock-item list --oldest", "docked"),
    "processes": ("process list --oldest", "finished", "running"),
    "outputs": ("output list", "kept"),
    "skills": ("agent-skill list", "journal-notes"),
    "documents": ("doc list", "Cart rules", "Release steps"),
    "document revisions": ("doc revisions 1", "added Returns"),
    "reports": ("link list --source report:1", "about  task:1"),
    "sequences": ("sequence show 1", "Release steps", "Run the whole suite"),
    "notices": ("notice list --environment demo", "Design for the checkout", "Build 12 of the cart"),
    "templates": ("template list", "Find what is missing (for plan, critique)", "Full suite (for any, testing)"),
}


@pytest.mark.parametrize("module", sorted(SHOWN))
def test_the_seeders_leave_each_modules_rows_where_its_window_shows_them(new_story, module):
    story = new_story(fixture=Demonstrated)
    command, *expected_texts = SHOWN[module]
    story.expect_text(command, *expected_texts)


def test_a_journal_that_holds_demo_rows_is_not_seeded_again(new_story):
    story = new_story(fixture=Demonstrated)
    story.expect_refusal("demo seed", "contains the demo already")


def test_the_seeders_run_in_the_order_of_what_their_modules_depend_on(new_story):
    story = new_story()
    story.expect_text("demo seed --list", "journal.core.actors", "journal.core.tasks", "journal.core.reviews")
    order = story.run("demo seed --list").output_text.splitlines()
    assert order.index("journal.core.actors") < order.index("journal.core.agents") < order.index("journal.core.tasks") < order.index("journal.core.reviews")


def test_every_module_that_seeds_is_named_in_the_demo(new_story):
    story = new_story()
    seeder_names = story.run("demo seed --list").output_text.splitlines()
    assert {"journal.core.tasks", "journal.core.plans", "journal.core.messages", "journal.core.questions", "journal.core.memories", "journal.core.reviews",
            "journal.core.docking", "journal.core.processes", "journal.core.skills", "journal.core.documents", "journal.core.sequences", "journal.core.templates"} <= set(seeder_names)
