import json
import shlex

from core.modules.helpers.support.agent_admission import AgentAdmission
from core.modules.helpers.support.agent_options import AgentOptions
from core.testing.fake_launcher import FakeLauncher
from tests.stories.core.modules.helpers.start_helper import START
from tests.stories.core.modules.helpers.helper_jobs import StartedHelper, helper_agent
from tests.stories.core.modules.helpers.helper_reports import enforced, helper_report
from tests.stories.core.modules.usage.support.status_files import save_status_file
from tests.stories.core.support.coding_fixtures import BuilderWithUser
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH
from tests.stories.suites.coding.support.main_controls_fixture import in_environment
from tests.stories.suites.coding.modules.workers.support.program_split import dispatch, exit_program, expect_program, new_task, split_story, split_viewer
from tests.stories.support.story_checks import expect_absent_value, expect_value

OPTIONS = "journal.core.helpers.agent-options"
ALLOWED_MODELS = "journal.core.helpers.allowed-models"


def set_options(story, *lines: str, scope: str = "--environment main") -> None:
    story.expect_success(f"setting set {OPTIONS} {shlex.quote(json.dumps(list(lines)))} {scope}", actor=story.user)


def new_reasons(story, agent_type: str, profile: str = "") -> list[str]:
    with in_environment(story):
        return story.container.get(AgentAdmission).new_reasons(agent_type, profile)


def test_s11_inheritance_without_options_allows_every_type_and_profile(new_story):
    story = new_story(fixture=BuilderWithUser)
    with in_environment(story):
        reading = story.container.get(AgentOptions).reading("worker", "journal-worker")
    expect_value((reading.source, reading.problems, reading.options.allow_new, reading.options.allowed_profiles), ("default", (), True, None))
    expect_absent_value(new_reasons(story, "worker", "journal-worker") + new_reasons(story, "helper", "journal-merger"))


def test_s11_inheritance_a_profile_line_wins_over_its_type_only_for_its_own_fields(new_story):
    story = new_story(fixture=BuilderWithUser)
    set_options(story, "helper allow_new=off", "helper:journal-merger allow_new=on")
    expect_absent_value(new_reasons(story, "helper", "journal-merger"))
    expect_value(new_reasons(story, "helper", "journal-researcher"), ["new helper sessions are switched off"])
    expect_absent_value(new_reasons(story, "worker", "journal-worker"))


def test_s13_inheritance_an_empty_allowed_profiles_list_denies_all_and_a_missing_one_allows_all(new_story):
    story = new_story(fixture=BuilderWithUser)
    set_options(story, "worker allowed_profiles=")
    expect_value(new_reasons(story, "worker", "journal-worker"), ["worker may not use the profile journal-worker"])
    set_options(story, "worker allowed_profiles=journal-worker")
    expect_absent_value(new_reasons(story, "worker", "journal-worker"))
    expect_value(new_reasons(story, "worker", "other-profile"), ["worker may not use the profile other-profile"])


def test_s12_inheritance_the_environment_list_replaces_the_project_list_and_names_its_source(new_story):
    story = new_story(fixture=BuilderWithUser)
    set_options(story, "helper allow_new=off", scope="--project")
    expect_value(new_reasons(story, "helper", "journal-researcher"), ["new helper sessions are switched off"])
    set_options(story, "worker allow_resume=off")
    with in_environment(story):
        reading = story.container.get(AgentOptions).reading("helper", "journal-researcher")
    expect_value((reading.source, reading.options.allow_new), ("environment", True))


def test_s52_inheritance_provider_and_model_restrictions_intersect_and_never_widen(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.expect_success(f"setting set {ALLOWED_MODELS} {shlex.quote(json.dumps(['claude opus', 'codex gpt']))} --environment main", actor=story.user)
    set_options(story, "worker allowed_providers=claude", "worker allowed_models=claude:opus")
    with in_environment(story):
        admission = story.container.get(AgentAdmission)
        reasons = [admission.model_reasons("worker", "journal-worker", provider, model) for provider, model in [("claude", "opus"), ("claude", "haiku"), ("codex", "gpt")]]
    expect_value(reasons[0], [])
    expect_value(len(reasons[1]), 2)
    expect_value(len(reasons[2]), 2)


def test_s61_invalid_legacy_policy_is_readable_and_repairable_inheritance(new_story):
    story = new_story(fixture=BuilderWithUser)
    set_options(story, "worker allow_new=maybe")
    with in_environment(story):
        reading = story.container.get(AgentOptions).reading("worker", "journal-worker")
        resume = story.container.get(AgentAdmission).resume_reasons("helper", "journal-researcher")
    expect_value((len(reading.problems), reading.options.allow_new, len(resume)), (1, False, 2))
    story.expect_success("setting set journal.suites.coding.workers.worker-run-limit 3 --environment main", actor=story.user)
    set_options(story, "worker allow_new=on")
    expect_absent_value(new_reasons(story, "worker", "journal-worker"))


def viewer_options(viewer, *lines: str) -> None:
    viewer.value("settings.settings", ["setting", "set", OPTIONS, json.dumps(list(lines)), "--environment", "main"])


def expect_no_worker(story, line: str, reason: str) -> None:
    story.expect_refusal(line, reason, actor=story.agent)
    story.expect_text("worker-worktree list", "nothing found")


def test_s14_inheritance_allowed_providers_refuse_the_program_of_the_sender_and_allow_a_named_one(split_story, split_viewer):
    viewer_options(split_viewer, "worker allowed_providers=codex")
    expect_no_worker(split_story, "worker dispatch 1", "worker may not use claude")
    expect_program(split_story, dispatch(split_story, flags="--program codex"), "codex")


def test_s15_inheritance_options_of_another_agent_type_leave_the_existing_program_choice_alone(split_story, split_viewer):
    viewer_options(split_viewer, "helper allow_new=off")
    expect_program(split_story, dispatch(split_story), "claude", "sonnet")


def test_s16_inheritance_the_common_split_only_chooses_among_the_allowed_providers(split_story, split_viewer):
    split_viewer.value("settings.settings", ["setting", "set", "journal.core.helpers.program-split", "claude 80,codex 20", "--project"])
    viewer_options(split_viewer, "worker allowed_providers=codex")
    expect_program(split_story, dispatch(split_story), "codex")


def test_s16_inheritance_an_empty_allowed_providers_list_leaves_no_program_for_the_split(split_story, split_viewer):
    split_viewer.value("settings.settings", ["setting", "set", "journal.core.helpers.program-split", "claude 80,codex 20", "--project"])
    viewer_options(split_viewer, "worker allowed_providers=")
    expect_no_worker(split_story, "worker dispatch 1", "no program can take this worker")


def test_s17_inheritance_allowed_models_narrow_the_model_of_the_profile_and_refuse_another(split_story, split_viewer):
    viewer_options(split_viewer, "worker allowed_models=claude:opus")
    expect_program(split_story, dispatch(split_story), "claude", "opus")
    second = new_task(split_story, "Total the cart")
    split_story.expect_refusal(f"worker dispatch --model sonnet {second}", "cannot run on claude", actor=split_story.agent)


def test_s18_inheritance_a_model_default_of_the_agent_options_replaces_the_profile_model(split_story, split_viewer):
    viewer_options(split_viewer, "worker model_defaults=claude:opus")
    expect_program(split_story, dispatch(split_story), "claude", "opus")


def test_s19_inheritance_a_strict_route_to_a_program_the_options_forbid_creates_no_worker(split_story, split_viewer):
    split_story.new_row_id("worker-route make --program codex --tags strict --strict --environment main", actor=split_story.agent)
    split_story.expect_success("task tag 1 strict --confirm", actor=split_story.agent)
    viewer_options(split_viewer, "worker allowed_providers=claude")
    expect_no_worker(split_story, "worker dispatch 1", "must go to codex")


def test_s52_inheritance_a_configured_model_list_naming_no_model_of_the_program_denies_instead_of_allowing_all(split_story, split_viewer):
    split_viewer.value("settings.settings", ["setting", "set", ALLOWED_MODELS, json.dumps(["codex gpt-6.1-sol"]), "--environment", "main"])
    expect_no_worker(split_story, "worker dispatch 1", "no allowed automatic model")


def stopped_worker(story):
    launcher = FakeLauncher(story.home.socket("launcher"), request_count=4)
    worker = dispatch(story)
    story.run_listeners()
    exit_program(story, worker)
    return worker, launcher


def test_s11_lifecycle_new_workers_off_refuses_a_dispatch_and_starts_nothing(split_story, split_viewer):
    viewer_options(split_viewer, "worker allow_new=off")
    expect_no_worker(split_story, "worker dispatch 1", "new worker sessions are switched off")


def test_s11_lifecycle_new_helpers_off_refuses_a_helper_start_and_starts_nothing(new_story):
    story = new_story(fixture=BuilderWithUser)
    set_options(story, "helper allow_new=off")
    launcher = FakeLauncher(story.home.socket("launcher"), request_count=1)
    story.expect_refusal(START, "new helper sessions are switched off", actor=story.agent)
    launcher.server.close()
    story.home.socket("launcher").unlink()
    story.expect_no_text("agent list", "role: helper", actor=story.user)


def test_s12_lifecycle_resume_off_or_a_forbidden_program_refuses_a_job_for_a_stopped_worker(split_story, split_viewer):
    worker, launcher = stopped_worker(split_story)
    viewer_options(split_viewer, "worker allow_resume=off")
    split_story.expect_refusal(f'worker send {worker.id} "go on"', "may not resume", actor=split_story.agent)
    viewer_options(split_viewer, "worker allowed_providers=codex")
    split_story.expect_refusal(f'worker send {worker.id} "go on"', "worker may not use claude", actor=split_story.agent)


def test_s13_lifecycle_an_empty_profile_list_refuses_a_dispatch_of_every_profile(split_story, split_viewer):
    viewer_options(split_viewer, "worker allowed_profiles=")
    expect_no_worker(split_story, "worker dispatch 1", "may not use the profile journal-worker")


RUN_LIMIT = "journal.suites.coding.workers.worker-run-limit"
PROFILE_LIMITS = "journal.core.helpers.read-only-helper-profile-limits"


def helper_profiles(story) -> dict[str, dict]:
    rows = json.loads(story.run("agent limits --json --environment main", actor=story.agent).output_text)["rows"]
    return {row["profile"]: row for row in next(row for row in rows if row["key"] == "helper")["profiles"]}


def test_s20_inheritance_an_unused_helper_profile_shows_the_common_limits_with_no_counts(new_story):
    story = new_story(fixture=BuilderWithUser)
    merger = helper_profiles(story)["journal-merger"]
    expect_value((merger["running"], merger["kept"], merger["run_limit"], merger["kept_limit"]), (0, 0, 4, 8))


def test_s21_inheritance_an_explicit_profile_limit_changes_only_that_profile(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.expect_success(f"setting set {PROFILE_LIMITS} {shlex.quote(json.dumps(['journal-merger:1:2']))} --environment main", actor=story.user)
    profiles = helper_profiles(story)
    merger, researcher = profiles["journal-merger"], profiles["journal-researcher"]
    expect_value(((merger["run_limit"], merger["kept_limit"]), (researcher["run_limit"], researcher["kept_limit"])), ((1, 2), (4, 8)))


def test_s21_inheritance_a_worker_run_limit_of_zero_starts_no_worker(split_story, split_viewer):
    split_viewer.value("settings.settings", ["setting", "set", RUN_LIMIT, "0", "--environment", "main"])
    expect_no_worker(split_story, "worker dispatch 1", "0 workers are running")


def test_pending_openings_share_one_limit(split_story, split_viewer):
    split_viewer.value("settings.settings", ["setting", "set", RUN_LIMIT, "1", "--environment", "main"])
    expect_program(split_story, dispatch(split_story), "claude")
    second = new_task(split_story, "Total the cart")
    split_story.expect_refusal(f"worker dispatch {second}", "1 workers are running", actor=split_story.agent)
    expect_value(len(split_story.run("worker-worktree list", actor=split_story.agent).output_text.strip().splitlines()), 1)


def test_failed_opening_releases_place_once(split_story, split_viewer):
    split_viewer.value("settings.settings", ["setting", "set", RUN_LIMIT, "1", "--environment", "main"])
    split_story.run("environment edit 1 --branch missing-branch")
    failed = split_story.run("worker dispatch 1", actor=split_story.agent)
    expect_value(failed.code != 0, True)
    split_story.expect_text("worker-worktree list", "nothing found")
    split_story.expect_success(f"environment edit 1 --branch {ENVIRONMENT_BRANCH}")
    expect_program(split_story, dispatch(split_story), "claude")
    second = new_task(split_story, "Total the cart")
    split_story.expect_refusal(f"worker dispatch {second}", "1 workers are running", actor=split_story.agent)


def test_special_designer_and_merger_profiles_each_show_once_with_the_common_helper_limits(new_story):
    story = new_story(fixture=BuilderWithUser)
    rows = json.loads(story.run("agent limits --json --environment main", actor=story.agent).output_text)["rows"]
    names = [row["profile"] for row in next(row for row in rows if row["key"] == "helper")["profiles"]]
    profiles = helper_profiles(story)
    expect_value((names.count("journal-designer"), names.count("journal-merger")), (1, 1))
    expect_value([(profiles[name]["run_limit"], profiles[name]["kept_limit"]) for name in ("journal-designer", "journal-merger")], [(4, 8), (4, 8)])


def test_s49_special_profiles_with_no_agents_add_nothing_to_the_helper_totals(new_story):
    story = new_story(fixture=BuilderWithUser)
    rows = json.loads(story.run("agent limits --json --environment main", actor=story.agent).output_text)["rows"]
    helper = next(row for row in rows if row["key"] == "helper")
    expect_value((helper["running"], helper["kept"], sum(row["running"] + row["kept"] for row in helper["profiles"])), (0, 0, 0))


def test_s22_a_helper_options_minutes_end_a_job_before_the_common_limit(new_story):
    story = new_story(fixture=StartedHelper)
    set_options(story, "helper max_minutes=10")
    enforced(story, 11)
    story.expect_text(f"message read {helper_report(story).id}", "stopped at its time limit")


def test_s23_a_profile_line_sets_a_fractional_cost_cap_and_a_zero_cap_is_unlimited(new_story):
    story = new_story(fixture=StartedHelper)
    set_options(story, "helper max_cost=0", "helper:journal-researcher max_cost=0.5")
    save_status_file(story, helper_agent(story).session, {"cost": {"total_cost_usd": 0.6}})
    enforced(story, 1)
    story.expect_text(f"message read {helper_report(story).id}", "stopped at its cost limit")


def test_s23_a_type_line_of_zero_cost_leaves_the_helper_running(new_story):
    story = new_story(fixture=StartedHelper)
    set_options(story, "helper max_cost=0")
    save_status_file(story, helper_agent(story).session, {"cost": {"total_cost_usd": 40}})
    enforced(story, 1)
    story.expect_rows(helper_agent(story).ended_at is None)
