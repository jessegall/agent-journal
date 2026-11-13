from tests.stories.core.support.agent_labels import agent_number
import json
import shlex

from core.modules.helpers.support.agent_admission import AgentAdmission
from core.modules.helpers.support.agent_options import AgentOptions
from core.modules.agents.testing.fake_launcher import FakeLauncher
from tests.stories.core.modules.helpers.start_helper import START
from tests.stories.core.modules.helpers.helper_jobs import StartedHelper, helper_agent
from tests.stories.core.modules.helpers.helper_reports import enforced, helper_report
from tests.stories.core.modules.usage.support.status_files import save_status_file
from tests.stories.core.support.coding_fixtures import UserBuilder
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH
from tests.stories.suites.coding.support.main_controls_fixture import scope_line
from tests.stories.suites.coding.modules.workers.support.program_split import dispatch, exit_program, expect_program, new_task, split_story, split_viewer
from tests.stories.support.story_checks import expect_absent_value, expect_value
from core.modules.helpers.support.helper_settings import AGENT_OPTIONS
from core.modules.helpers.support.helper_settings import ALLOWED_MODELS
from core.modules.helpers.support.helper_settings import HELPER_PROFILE_LIMITS
from suites.coding.modules.workers.support.worker_settings import WORKER_RUN_LIMIT
from suites.coding.support.shipped_profiles import MERGER_PROFILE
from suites.coding.support.shipped_profiles import RESEARCHER_PROFILE
from suites.coding.support.shipped_profiles import WORKER_PROFILE

OPTIONS = f"{AGENT_OPTIONS}"
ALLOWED_MODELS = f"{ALLOWED_MODELS}"


def set_options(story, *lines: str, scope: str = "--environment main") -> None:
    story.expect_success(f"setting set {OPTIONS} {shlex.quote(json.dumps(list(lines)))} {scope}", actor=story.user)


def new_reasons(story, agent_type: str, profile: str = "") -> list[str]:
    with scope_line(story):
        return story.container.get(AgentAdmission).new_reasons(agent_type, profile)


def test_s11_inheritance_without_options_allows_every_type_and_profile(new_story):
    story = new_story(fixture=UserBuilder)
    with scope_line(story):
        resolved = story.container.get(AgentOptions).resolved("worker", f"{WORKER_PROFILE.name}")
    expect_value((resolved.source, resolved.problems, resolved.options.allow_new, resolved.options.allowed_profiles), ("default", (), True, None))
    expect_absent_value(new_reasons(story, "worker", f"{WORKER_PROFILE.name}") + new_reasons(story, "helper", f"{MERGER_PROFILE.name}"))


def test_s12_inheritance_the_environment_list_replaces_the_project_list_and_names_its_source(new_story):
    story = new_story(fixture=UserBuilder)
    set_options(story, "helper allow_new=off", scope="--project")
    expect_value(new_reasons(story, "helper", f"{RESEARCHER_PROFILE.name}"), ["new helper sessions are switched off"])
    set_options(story, "worker allow_resume=off")
    with scope_line(story):
        resolved = story.container.get(AgentOptions).resolved("helper", f"{RESEARCHER_PROFILE.name}")
    expect_value((resolved.source, resolved.options.allow_new), ("environment", True))


def test_s52_inheritance_provider_and_model_restrictions_intersect_and_never_widen(new_story):
    story = new_story(fixture=UserBuilder)
    story.expect_success(f"setting set {ALLOWED_MODELS} {shlex.quote(json.dumps(['claude opus', 'codex gpt']))} --environment main", actor=story.user)
    set_options(story, "worker allowed_providers=claude", "worker allowed_models=claude:opus")
    with scope_line(story):
        admission = story.container.get(AgentAdmission)
        reasons = [admission.model_reasons("worker", f"{WORKER_PROFILE.name}", provider, model) for provider, model in [("claude", "opus"), ("claude", "haiku"), ("codex", "gpt")]]
    expect_value(reasons[0], [])
    expect_value(len(reasons[1]), 2)
    expect_value(len(reasons[2]), 2)


def test_s61_invalid_legacy_policy_is_readable_and_repairable_inheritance(new_story):
    story = new_story(fixture=UserBuilder)
    set_options(story, "worker allow_new=maybe")
    with scope_line(story):
        resolved = story.container.get(AgentOptions).resolved("worker", f"{WORKER_PROFILE.name}")
        resume = story.container.get(AgentAdmission).resume_reasons("helper", f"{RESEARCHER_PROFILE.name}")
    expect_value((len(resolved.problems), resolved.options.allow_new, len(resume)), (1, False, 2))
    story.expect_success(f"setting set {WORKER_RUN_LIMIT} 3 --environment main", actor=story.user)
    set_options(story, "worker allow_new=on")
    expect_absent_value(new_reasons(story, "worker", f"{WORKER_PROFILE.name}"))


def viewer_options(viewer, *lines: str) -> None:
    viewer.value("settings.settings", ["setting", "set", OPTIONS, json.dumps(list(lines)), "--environment", "main"])


def expect_worker_absent(story, line: str, reason: str) -> None:
    story.expect_refusal(line, reason, actor=story.agent)
    story.expect_text("worker-worktree list", "nothing found")


def test_s14_inheritance_allowed_providers_refuse_the_program_of_the_sender_and_allow_a_named_one(split_story, split_viewer):
    viewer_options(split_viewer, "worker allowed_providers=codex")
    expect_worker_absent(split_story, "worker dispatch --test-command python=pytest 1", "worker may not use claude")
    expect_program(split_story, dispatch(split_story, flags="--program codex"), "codex")


def test_s17_inheritance_allowed_models_narrow_the_model_of_the_profile_and_refuse_another(split_story, split_viewer):
    viewer_options(split_viewer, "worker allowed_models=claude:opus")
    expect_program(split_story, dispatch(split_story), "claude", "opus")
    second = new_task(split_story, "Total the cart")
    split_story.expect_refusal(f"worker dispatch --test-command python=pytest --model sonnet {second}", "cannot run on claude", actor=split_story.agent)


def test_s19_inheritance_a_strict_route_to_a_program_the_options_forbid_creates_no_worker(split_story, split_viewer):
    split_story.new_row_id("worker-route make --program codex --tags strict --strict --environment main", actor=split_story.agent)
    split_story.expect_success("task tag 1 strict --confirm", actor=split_story.agent)
    viewer_options(split_viewer, "worker allowed_providers=claude")
    expect_worker_absent(split_story, "worker dispatch --test-command python=pytest 1", "must go to codex")


def stopped_worker(story):
    launcher = FakeLauncher.accepting(story.home.socket("launcher"), request_count=4)
    worker = dispatch(story)
    story.run_listeners()
    exit_program(story, worker)
    return worker, launcher


def test_s11_lifecycle_new_helpers_off_refuses_a_helper_start_and_starts_nothing(new_story):
    story = new_story(fixture=UserBuilder)
    set_options(story, "helper allow_new=off")
    launcher = FakeLauncher.accepting(story.home.socket("launcher"), request_count=1)
    story.expect_refusal(START, "new helper sessions are switched off", actor=story.agent)
    launcher.server.close()
    story.home.socket("launcher").unlink()
    story.expect_no_text("agent list", "role: helper", actor=story.user)


def test_s12_lifecycle_resume_off_or_a_forbidden_program_refuses_a_job_for_a_stopped_worker(split_story, split_viewer):
    worker, launcher = stopped_worker(split_story)
    viewer_options(split_viewer, "worker allow_resume=off")
    split_story.expect_refusal(f'worker send {agent_number(split_story, worker.id)} "go on"', "may not resume", actor=split_story.agent)
    viewer_options(split_viewer, "worker allowed_providers=codex")
    split_story.expect_refusal(f'worker send {agent_number(split_story, worker.id)} "go on"', "worker may not use claude", actor=split_story.agent)


RUN_LIMIT = f"{WORKER_RUN_LIMIT}"
PROFILE_LIMITS = f"{HELPER_PROFILE_LIMITS}"


def helper_profiles(story) -> dict[str, dict]:
    rows = json.loads(story.run("agent limits --json --environment main", actor=story.agent).output_text)["rows"]
    return {row["profile"]: row for row in next(row for row in rows if row["key"] == "helper")["profiles"]}


def test_s21_inheritance_an_explicit_profile_limit_changes_only_that_profile(new_story):
    story = new_story(fixture=UserBuilder)
    story.expect_success(f"setting set {PROFILE_LIMITS} {shlex.quote(json.dumps([f'{MERGER_PROFILE.name}:1:2']))} --environment main", actor=story.user)
    profiles = helper_profiles(story)
    merger, researcher = profiles[f"{MERGER_PROFILE.name}"], profiles[f"{RESEARCHER_PROFILE.name}"]
    expect_value(((merger["run_limit"], merger["kept_limit"]), (researcher["run_limit"], researcher["kept_limit"])), ((1, 2), (4, 8)))


def test_pending_openings_share_one_limit(split_story, split_viewer):
    split_viewer.value("settings.settings", ["setting", "set", RUN_LIMIT, "1", "--environment", "main"])
    expect_program(split_story, dispatch(split_story), "claude")
    second = new_task(split_story, "Total the cart")
    split_story.expect_refusal(f"worker dispatch --test-command python=pytest {second}", "1 workers are running", actor=split_story.agent)
    expect_value(len(split_story.run("worker-worktree list", actor=split_story.agent).output_text.strip().splitlines()), 1)


def test_failed_opening_releases_place_once(split_story, split_viewer):
    split_viewer.value("settings.settings", ["setting", "set", RUN_LIMIT, "1", "--environment", "main"])
    split_story.run("environment edit 1 --branch missing-branch")
    failed = split_story.run("worker dispatch --test-command python=pytest 1", actor=split_story.agent)
    expect_value(failed.code != 0, True)
    split_story.expect_text("worker-worktree list", "nothing found")
    split_story.expect_success(f"environment edit 1 --branch {ENVIRONMENT_BRANCH}")
    expect_program(split_story, dispatch(split_story), "claude")
    second = new_task(split_story, "Total the cart")
    split_story.expect_refusal(f"worker dispatch --test-command python=pytest {second}", "1 workers are running", actor=split_story.agent)


def test_s22_a_helper_options_minutes_end_a_job_before_the_common_limit(new_story):
    story = new_story(fixture=StartedHelper)
    set_options(story, "helper max_minutes=10")
    enforced(story, 11)
    story.expect_text(f"message read {helper_report(story).id}", "stopped at its time limit")
