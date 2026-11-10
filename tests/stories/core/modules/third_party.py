import json

from engine.database.database import Database
from engine.registry.registry import Registry
from engine.testing.expectations.expect_row import expect_row
from tests.stories.fixtures.third_party import third_party, third_party_cookie, viewer_body
from tests.stories.server.support.browser_story import expect_browser
from tests.stories.server.support.server_client import request_answer
from tests.stories.support.story_checks import expect_value


def test_a_coding_module_adds_its_template_to_the_critique_choices(third_party):
    story = third_party.story
    story.expect_text("template list --target plan --purpose critique", "Security review", "Module: acme.review")
    template = next(entry for entry in json.loads(story.run("template list --json").output_text)["rows"] if entry["title"] == "Security review")
    story.expect_success(f'template send {template["id"]} --on=plan:1 --set=agents=2 --set=size="a normal read" --environment main', actor=story.user)
    story.expect_text("plan comments 1", "(Security review), and compile what they find into a report linked to the plan.")
    story.expect_absent("message feed", "Security review")


def test_a_button_names_its_module_and_requires_a_persons_allowance(third_party, third_party_cookie):
    offered = json.loads(viewer_body(third_party, "/api/buttons?environment=main", third_party_cookie))
    button = next(button for button in offered["buttons"] if button["name"] == "review.audit")
    expect_row(button, module="acme.review", **{"from": "acme.review"}, label="Audit", runs="acme audit {row_id}",
               slots=["dock.plans.waiting", "row.plan"])
    expect_value(offered["missing"]["acme.review"], [{"label": "Audit", "line": "acme audit {row_id}"}])
    third_party.story.expect_success("window allow button:acme.legal --type runs --environment main", actor=third_party.story.user)
    line = {"window": "messages.chat", "line": ["acme", "audit", "1"], "environment": "main"}
    third_party.expect_viewer_line(third_party_cookie, line, 200, '"code": 1')
    third_party.story.expect_success("window allow button:acme.review --type runs --environment main", actor=third_party.story.user)
    third_party.expect_viewer_line(third_party_cookie, line, 200, "Audited plan 1: Cart security")
    third_party.expect_viewer_status("/api/buttons?environment=main", 200, third_party_cookie, text='"missing": {}')


def test_a_third_party_suite_adds_its_window_without_changing_the_default(third_party, third_party_cookie):
    story = third_party.story
    story.expect_success("suite current main", "suite: coding", "drivers: helper: coding.helper, main: coding.main, worker: coding.worker")
    offered = json.loads(viewer_body(third_party, "/api/windows?environment=main", third_party_cookie))
    story.expect_rows("findings.findings" not in json.dumps(offered))
    story.expect_success("suite choose acme --environment main", actor=story.user)
    third_party.expect_viewer_status("/api/windows?environment=main", 200, third_party_cookie, text="findings.findings")
    third_party.expect_viewer_status("/api/windows?environment=main", 200, third_party_cookie, text="messages.chat")
    registry = Registry.read(story.container.get(Database))
    story.expect_rows("findings.row" in registry.button_slots)


def test_a_third_party_window_draws_its_own_slot_and_a_press_runs_after_the_prompt(third_party):
    third_party.story.expect_success("suite choose acme --environment main", actor=third_party.story.user)
    third_party.story.expect_success("window trust acme.findings --environment main", actor=third_party.story.user)
    expect_browser(third_party, "thirdPartyWindow.browser.mjs", [])


def test_story_5_a_person_holds_a_task_and_an_agent_is_refused(third_party):
    story = third_party.story
    story.expect_success('task make "Fix the cart" --environment main', actor=story.user)
    story.expect_refusal("task hold 1", "comes from a module the journal does not ship", actor=story.agent)
    story.expect_success("task hold 1", actor=story.user)
    story.expect_text("task show 1", "state: legal-hold", actor=story.user)
    story.expect_success("task release-hold 1", actor=story.user)
    story.expect_text("task show 1", "state: open", actor=story.user)


def test_story_8_the_modules_removal_leaves_the_row_in_its_fallback_state(third_party):
    story = third_party.story
    story.expect_success('task make "Fix the cart" --environment main', actor=story.user)
    story.expect_success("task hold 1", actor=story.user)
    answer = request_answer(third_party.socket_path, "POST", "/cli", {"argv": ["module", "remove", "acme.legal"], "variables": {"USER": "Ada"}, "folder": "/"})
    expect_value(answer.exit_code, 0)
    story.expect_rows(story.synced()[0] == 0)
    story.expect_text("task show 1", "state: open", actor=story.user)


def test_story_9_a_module_whose_entry_vanishes_leaves_the_row_in_its_fallback_state_and_says_so(third_party):
    story = third_party.story
    story.expect_success('task make "Fix the totals" --environment main', actor=story.user)
    story.expect_success("task hold 1", actor=story.user)
    listed = story.home.module_list
    listed.write_text(json.dumps([path for path in json.loads(listed.read_text()) if "acme_legal" not in path]))
    code, report = story.synced()
    story.expect_rows(code == 0, "1 task rows left the state legal-hold and are open" in report)
    story.expect_text("task show 1", "state: open", actor=story.user)


def test_another_suite_hides_templates_and_buttons_but_keeps_commands(third_party, third_party_cookie):
    story = third_party.story
    story.expect_success("suite choose control --environment main", actor=story.user)
    story.expect_no_text("template list --environment main", "Security review")
    offered = json.loads(viewer_body(third_party, "/api/buttons?environment=main", third_party_cookie))
    story.expect_rows(all(button["module"] != "acme.review" for button in offered["buttons"]))
    story.expect_success("acme audit 1", "Audited plan 1: Cart security")


def test_removal_deletes_the_modules_buttons_templates_and_permissions(third_party, third_party_cookie):
    story = third_party.story
    story.expect_success("window allow button:acme.review --type runs --environment main", actor=story.user)
    answer = request_answer(third_party.socket_path, "POST", "/cli", {"argv": ["module", "remove", "acme.review"],
                                                                    "variables": {"USER": "Ada"}, "folder": "/"})
    expect_value(answer.exit_code, 0)
    offered = json.loads(viewer_body(third_party, "/api/buttons?environment=main", third_party_cookie))
    story.expect_rows(all(button["module"] != "acme.review" for button in offered["buttons"]))
    code, text = story.synced()
    story.expect_rows(code == 0)
    story.expect_no_text("template list --environment main", "Security review")
    story.expect_no_text("window-permission list", "button:acme.review")
