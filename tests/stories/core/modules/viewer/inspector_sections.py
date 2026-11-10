import json
from pathlib import Path

from engine.database.database import Database
from engine.registry.registry import Registry
from core.testing.expect_row import expect_row
from tests.stories.core.modules.viewer.support import section_modules
from tests.stories.core.support.fixtures import MainEnvironment
from tests.stories.fixtures.third_party import plan_notes, plan_notes_cookie, viewer_body
from tests.stories.server.support.browser_story import expect_browser
from tests.stories.server.support.server_client import request_answer
from tests.stories.support.story_checks import expect_value

NOTES_READ = {"window": "plan_notes.notes", "line": ["plan", "show", "1"], "environment": "main"}


def listed_windows(server, cookie) -> list[dict]:
    return json.loads(viewer_body(server, "/api/windows?environment=main", cookie))["windows"]


def listed_section(server, cookie, name: str) -> dict:
    return next(window for window in listed_windows(server, cookie) if window["name"] == name)


def allow(server, cookie, window: str, permission_type: str) -> None:
    server.viewer_line_value(cookie, {"window": "viewer.shell", "line": ["window", "allow", window, "--type", permission_type], "environment": "main"})


def test_a_sample_module_adds_a_button_and_a_section_to_plans_with_no_change_in_the_plans_module(plan_notes, plan_notes_cookie):
    section = listed_section(plan_notes, plan_notes_cookie, "plan_notes.notes")
    expect_row(section, module="acme.plan_notes", place="section", slots=["inspector.plan"], reads=["plan show"], events=["plan.*"], allowed=False)
    plan_notes.story.expect_rows(section["entry_url"].startswith("/modules/acme.plan_notes/notes.js?v="))
    button = next(button for button in json.loads(viewer_body(plan_notes, "/api/buttons?environment=main", plan_notes_cookie))["buttons"] if button["name"] == "plan_notes.note")
    expect_row(button, module="acme.plan_notes", label="Note it", runs="plan-notes add {row_id}", slots=["row.plan"])
    plan_notes.expect_viewer_line(plan_notes_cookie, {"window": "messages.chat", "line": ["plan-notes", "add", "1"], "environment": "main"}, 200, '"code": 1')
    plan_notes.story.expect_success("window allow button:acme.plan_notes --type runs --environment main", actor=plan_notes.story.user)
    plan_notes.expect_viewer_line(plan_notes_cookie, {"window": "messages.chat", "line": ["plan-notes", "add", "1"], "environment": "main"}, 200, "Noted plan 1: Cart security")


def test_the_person_sees_the_samples_section_and_button_in_the_plan_inspector(plan_notes):
    plan_notes.story.expect_success("window trust acme.plan_notes --environment main", actor=plan_notes.story.user)
    plan_notes.story.expect_success('plan make "Tax rules" --environment main')
    expect_browser(plan_notes, "inspectorSections.browser.mjs", ["notes", str(plan_notes.socket_path)])


def test_a_section_lists_the_slots_it_names_and_no_other(plan_notes, plan_notes_cookie):
    second_section = listed_section(plan_notes, plan_notes_cookie, "sections.elsewhere")
    expect_value(second_section["slots"], ["inspector.task", "inspector.doc", "inspector.report", "inspector.agent", "inspector.memory"])
    plan_notes.story.expect_rows("inspector.plan" not in second_section["slots"])


def test_the_person_sees_a_section_on_a_task_and_a_memory_and_not_on_a_plan(plan_notes):
    plan_notes.story.expect_success("window trust acme.sections --environment main", actor=plan_notes.story.user)
    plan_notes.story.expect_success('task make "Fix the cart" --environment main', actor=plan_notes.story.user)
    plan_notes.story.expect_success('memory make "Carts are heavy" --weight 1 --environment main', actor=plan_notes.story.agent)
    expect_browser(plan_notes, "inspectorSections.browser.mjs", ["elsewhere", str(plan_notes.socket_path)])


def test_the_registry_offers_one_inspector_slot_per_model_apart_from_the_button_slots(new_story):
    story = new_story(fixture=MainEnvironment)
    registry = Registry.read(story.container.get(Database))
    story.expect_rows({"inspector.plan", "inspector.task", "inspector.doc", "inspector.report", "inspector.agent", "inspector.memory"} <= set(registry.inspector_slots),
                      not any(slot.startswith("inspector.") for slot in registry.button_slots))


def test_a_section_on_an_unknown_slot_refuses_the_sync(new_story):
    story = new_story(fixture=MainEnvironment)
    story.expect_sync_refusal(section_modules.UNKNOWN_SLOT, "the window wrong_slot.notes uses unknown slot inspector.plna")


def test_a_section_on_the_slot_of_a_module_it_does_not_depend_on_refuses_the_sync(new_story):
    story = new_story(fixture=MainEnvironment)
    story.expect_sync_refusal(section_modules.UNDEPENDED_SLOT, "the window not_depending.notes uses slot inspector.plan of journal.core.plans, which it depends on only when listed in dependencies")


def test_a_section_with_no_slot_refuses_the_sync(new_story):
    story = new_story(fixture=MainEnvironment)
    story.expect_sync_refusal(section_modules.SLOTLESS_MODULE, "no_slot.notes is a section and names no slot")


def test_slots_on_a_pane_window_refuse_the_sync(new_story):
    story = new_story(fixture=MainEnvironment)
    story.expect_sync_refusal(section_modules.PANE_WITH_SLOTS, "pane_slots.notes names slots, and only a section has them")


def test_a_suite_that_names_a_section_refuses_the_sync(new_story):
    story = new_story(fixture=MainEnvironment)
    story.expect_sync_refusal(section_modules.SECTION_SUITE_MODULE, "suite sections names the section section_suite.notes, which an inspector draws and no pane offers")


def test_a_button_on_an_inspector_slot_refuses_the_sync(new_story):
    story = new_story(fixture=MainEnvironment)
    story.expect_sync_refusal(section_modules.INSPECTOR_SLOT_BUTTON, "uses unknown slot inspector.plan")


def test_a_correct_section_syncs_into_the_registry(new_story):
    story = new_story(fixture=MainEnvironment)
    story.expect_sync_success(section_modules.GOOD_SECTION)
    entry = Registry.read(story.container.get(Database)).window("good_section.notes")
    expect_row(entry, place="section", slots=tuple(["inspector.plan"]), module="good_section")


def test_a_section_of_a_module_whose_suite_is_not_chosen_is_not_listed(plan_notes, plan_notes_cookie):
    plan_notes.story.expect_success("suite choose control --environment main", actor=plan_notes.story.user)
    plan_notes.story.expect_rows(all(window["module"] != "acme.plan_notes" for window in listed_windows(plan_notes, plan_notes_cookie)))


def test_a_sections_read_waits_for_the_persons_allowance_and_then_answers(plan_notes, plan_notes_cookie):
    plan_notes.expect_viewer_line(plan_notes_cookie, NOTES_READ, 200, "plan_notes.notes may run plan show once you allow it")
    allow(plan_notes, plan_notes_cookie, "plan_notes.notes", "reads")
    plan_notes.expect_viewer_line(plan_notes_cookie, NOTES_READ, 200, "Cart security")


def test_a_section_cannot_read_a_line_it_did_not_declare(plan_notes, plan_notes_cookie):
    plan_notes.expect_viewer_line(plan_notes_cookie, {"window": "sections.undeclared", "line": ["task", "list"], "environment": "main"}, 200, "sections.undeclared does not declare task list")


def test_a_section_may_never_run_a_person_only_line(plan_notes, plan_notes_cookie):
    plan_notes.expect_viewer_line(plan_notes_cookie, {"window": "plan_notes.notes", "line": ["window", "allow", "plan_notes.notes", "--type", "reads"], "environment": "main"},
                                  200, "plan_notes.notes may never run window allow")


def test_a_sections_failing_read_answers_its_failure_and_the_inspectors_own_read_still_works(plan_notes, plan_notes_cookie):
    allow(plan_notes, plan_notes_cookie, "sections.failing", "reads")
    plan_notes.expect_viewer_line(plan_notes_cookie, {"window": "sections.failing", "line": ["plan", "show", "99999"], "environment": "main"}, 200, '"code": 1')
    plan_notes.viewer_line_value(plan_notes_cookie, {"window": "viewer.shell", "line": ["plan", "inspect", "1"], "environment": "main"})


def test_the_person_sees_a_failing_read_and_a_throwing_section_without_harm_to_the_inspector(plan_notes):
    plan_notes.story.expect_success("window trust acme.sections --environment main", actor=plan_notes.story.user)
    plan_notes.story.expect_success("window trust acme.plan_notes --environment main", actor=plan_notes.story.user)
    expect_browser(plan_notes, "inspectorSections.browser.mjs", ["failing", str(plan_notes.socket_path)])


def test_a_section_with_no_trust_says_how_to_trust_it_and_the_inspector_works(plan_notes):
    expect_browser(plan_notes, "inspectorSections.browser.mjs", ["untrusted", str(plan_notes.socket_path)])


def test_shipped_sections_are_listed_before_a_third_partys(plan_notes, plan_notes_cookie):
    sections = [window for window in listed_windows(plan_notes, plan_notes_cookie) if window["place"] == "section" and "inspector.plan" in window["slots"]]
    shipped = [window["allowed"] for window in sections]
    expect_value(shipped, sorted(shipped, reverse=True))
    plan_notes.story.expect_rows({"plan_reviews.rounds", "reviews.subject-reviews", "plan_notes.notes"} <= {window["name"] for window in sections})


def test_a_module_removed_takes_its_section_and_button_and_the_inspector_works(plan_notes, plan_notes_cookie):
    allow(plan_notes, plan_notes_cookie, "plan_notes.notes", "reads")
    answer = request_answer(plan_notes.socket_path, "POST", "/cli", {"argv": ["module", "remove", "acme.plan_notes"], "variables": {"USER": "Ada"}, "folder": "/"})
    expect_value(answer.exit_code, 0)
    plan_notes.story.expect_rows(all(window["module"] != "acme.plan_notes" for window in listed_windows(plan_notes, plan_notes_cookie)))
    buttons = json.loads(viewer_body(plan_notes, "/api/buttons?environment=main", plan_notes_cookie))["buttons"]
    plan_notes.story.expect_rows(all(button["module"] != "acme.plan_notes" for button in buttons))
    code, _ = plan_notes.story.synced()
    plan_notes.story.expect_rows(code == 0)
    plan_notes.story.run_listeners()
    plan_notes.story.expect_no_text("window-permission list", "plan_notes.notes")
    plan_notes.viewer_line_value(plan_notes_cookie, {"window": "viewer.shell", "line": ["plan", "inspect", "1"], "environment": "main"})


def test_the_person_watches_a_removed_module_take_its_section_from_an_open_inspector(plan_notes):
    plan_notes.story.expect_success("window trust acme.plan_notes --environment main", actor=plan_notes.story.user)
    expect_browser(plan_notes, "inspectorSections.browser.mjs", ["removal", str(plan_notes.socket_path)])


def test_the_module_guide_shows_the_samples_own_declaration_and_commands_that_exist(plan_notes):
    checkout = Path(__file__).resolve().parents[5]
    guide = (checkout / "docs/writing-a-module.md").read_text()
    declared = (checkout / "tests/stories/fixtures/acme_plan_notes/module.py").read_text()
    windows = declared[declared.index("    windows = "):].rstrip()
    plan_notes.story.expect_rows(windows in guide, "journal module add tests/stories/fixtures/acme_plan_notes" in guide, "journal window trust acme.plan_notes --environment main" in guide)
    plan_notes.story.expect_success("window trust acme.plan_notes --environment main", actor=plan_notes.story.user)


def test_an_agent_cannot_remove_a_module_with_a_section(plan_notes):
    answer = request_answer(plan_notes.socket_path, "POST", "/cli", {"argv": ["module", "remove", "acme.plan_notes"], "variables": {"JOURNAL_AGENT_SESSION": "s-agent"}, "folder": "/"})
    plan_notes.story.expect_rows(answer.exit_code != 0)
    plan_notes.story.expect_rows("plan_notes.notes" in [window.name for window in Registry.read(plan_notes.story.container.get(Database)).windows])
