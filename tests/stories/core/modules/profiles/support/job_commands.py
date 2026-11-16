from tests.stories.core.support.agent_labels import agent_number
import shlex
import tomllib
from pathlib import Path

from engine.enums.command_category import CommandCategory
from engine.journal.journal_home import JournalHome
from engine.provider.providers import Providers
from engine.text.text_digest import TextDigest
from engine.registry.registry import Registry
from core.modules.profiles.support.profile_files import ProfileFiles
from suites.coding.support.shipped_profiles import HELPER_PROFILES, WORKER_PROFILES

from engine.setting.setting_values import SettingValues
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import repository_environment, dispatched_worker
from suites.coding.support.shipped_profiles import CODE_REVIEWER_PROFILE
from suites.coding.support.shipped_profiles import DEBUGGER_PROFILE
from suites.coding.support.shipped_profiles import DESIGNER_PROFILE
from suites.coding.support.shipped_profiles import FUNCTIONAL_DESIGNER_PROFILE
from suites.coding.support.shipped_profiles import MERGER_PROFILE
from suites.coding.support.shipped_profiles import PLANNER_PROFILE
from suites.coding.support.shipped_profiles import PLAN_REVIEWER_PROFILE
from suites.coding.support.shipped_profiles import RESEARCHER_PROFILE
from suites.coding.support.shipped_profiles import WORKER_MEDIOR_PROFILE
from suites.coding.support.shipped_profiles import WORKER_PROFILE
from suites.coding.support.shipped_profiles import WORKER_SENIOR_PROFILE

SHIPPED_PROFILES = (*HELPER_PROFILES, *WORKER_PROFILES)

ROOT = Path(__file__).resolve().parents[6]
PROFILE_COMMANDS = {
    f"{WORKER_PROFILE.name}": ("journal task --help", "journal worker ask-merge"),
    f"{MERGER_PROFILE.name}": ("journal merger next", "journal merger merge", "journal merger findings", "journal proof list --task", "journal proof show", "journal proof check", "journal proof short", "journal worker logs"),
    f"{PLANNER_PROFILE.name}": ("journal plan make", "journal phase make", "journal task make", "journal doc make"),
    f"{RESEARCHER_PROFILE.name}": ("journal search find", "journal doc make", "journal report make"),
    f"{DEBUGGER_PROFILE.name}": ("journal search find", "journal task show", "journal output read"),
    f"{PLAN_REVIEWER_PROFILE.name}": ("journal plan outline", "journal phase show", "journal task show"),
    f"{WORKER_MEDIOR_PROFILE.name}": ("journal task overview", "journal task log", "journal proof make", "journal task start", "journal worker commit", "journal worker ask-merge"),
    f"{WORKER_SENIOR_PROFILE.name}": ("journal task overview", "journal task log", "journal proof make", "journal task start", "journal worker commit", "journal worker ask-merge"),
    f"{CODE_REVIEWER_PROFILE.name}": ("journal search find", "journal task make", "journal task list", "journal doc show", "journal report make"),
    f"{FUNCTIONAL_DESIGNER_PROFILE.name}": ("journal sequence list", "journal sequence run", "journal doc make", "journal search find"),
    f"{DESIGNER_PROFILE.name}": ("journal doc make", "journal doc show", "journal report make", "journal search find", "journal task show"),
}
PROJECT_COMMANDS = {
    "code-reviewer": ("journal search find", "journal report make"),
    "plan-reviewer": ("journal plan outline", "journal task show", "journal doc show"),
    "designer": ("journal task show", "journal doc show", "journal search find"),
}


def expect_published_commands(story) -> None:
    (story.home.project_folder / ".codex").mkdir(exist_ok=True)
    files = story.container.get(ProfileFiles)
    files.publish()
    assert set(PROFILE_COMMANDS) == {profile.name for profile in SHIPPED_PROFILES}
    for profile in SHIPPED_PROFILES:
        claude = files.read(files.folder(".claude/agents") / f"{profile.name}.md")
        codex = tomllib.loads((files.folder(".codex/agents") / f"{profile.name}.toml").read_text())
        assert claude.body == codex["developer_instructions"], profile.name
        for command in PROFILE_COMMANDS[profile.name]:
            assert command in claude.body, (profile.name, command)
        assert "--help" in claude.body, profile.name
    planner = next(profile for profile in SHIPPED_PROFILES if profile.name == f"{PLANNER_PROFILE.name}")
    for subject in ("plan", "phase", "task"):
        help_text = story.run(f"{subject} --help").output_text
        for subcommand in help_text.splitlines()[1:]:
            assert f"journal {subject} {subcommand.strip()}" in planner.body, (subject, subcommand)
    for name, commands in PROJECT_COMMANDS.items():
        profile = profile_definition(story, name)
        for command in commands:
            assert command in profile.body, (name, command)
        codex_path = ROOT / ".codex" / "agents" / f"{name}.toml"
        if codex_path.exists():
            assert tomllib.loads(codex_path.read_text())["developer_instructions"] == profile.body, name


def profile_definition(story, name: str):
    if name in PROJECT_COMMANDS:
        files = ProfileFiles(JournalHome(ROOT / ".journal"), story.container.get(SettingValues), story.container.get(Registry), story.container.get(TextDigest), story.container.get(Providers))
        return files.read(ROOT / ".claude" / "agents" / f"{name}.md")
    return next(profile for profile in SHIPPED_PROFILES if profile.name == name)


def run_helper_command(story, profile: str, command: str) -> None:
    definition = profile_definition(story, profile)
    prefix = " ".join(shlex.split(command)[:2])
    assert f"journal {prefix}" in definition.body, (profile, prefix)
    story.expect_success(f"agent edit {agent_number(story, story.helper.id)} --profile {profile}")
    sample = HookSamples.shell(f"journal {command}", ShellPart("journal", CommandCategory.JOURNAL, shlex.split(command), subcommand=command.split()[0])).with_fields(helper="sub-1")
    story.expect_hook_allowed("s-1", sample)
    story.expect_success(command, actor=story.helper)


def expect_helper_commands(story) -> None:
    run_helper_command(story, f"{PLANNER_PROFILE.name}", 'doc make "Cart design" --abstract "Plan the cart" --body "Keep totals in cents."')
    run_helper_command(story, f"{PLANNER_PROFILE.name}", 'plan make "Cart" --brief "Keep totals correct" --environment main')
    run_helper_command(story, f"{PLANNER_PROFILE.name}", 'phase make --plan 1 "Totals" --goal "Totals use cents"')
    run_helper_command(story, f"{PLANNER_PROFILE.name}", 'task make "Use cents" --brief "Store integer cents" --environment main')
    run_helper_command(story, f"{RESEARCHER_PROFILE.name}", 'report make "Cart findings" --abstract "Totals" --body "Totals use cents."')
    run_helper_command(story, f"{RESEARCHER_PROFILE.name}", 'report list')
    run_helper_command(story, f"{PLAN_REVIEWER_PROFILE.name}", "plan outline 1")
    run_helper_command(story, f"{DEBUGGER_PROFILE.name}", "task show 1")
    run_helper_command(story, "code-reviewer", 'report make "Cents review" --abstract "Totals" --body "Totals use integer cents."')
    run_helper_command(story, "plan-reviewer", "plan outline 1")
    run_helper_command(story, "designer", "task show 1")


def expect_worker_commands(story) -> None:
    repository_environment(story)
    for profile in (f"{WORKER_MEDIOR_PROFILE.name}", f"{WORKER_SENIOR_PROFILE.name}"):
        task = story.new_row_id(f'task make "Work for {profile}" --brief "1. Keep the total in cents" --environment main', actor=story.agent)
        worker = dispatched_worker(story, f"worker dispatch --test-command python=pytest {task} --model sonnet --profile {profile}")
        story.expect_success(f"task overview {task}", actor=worker)
        story.expect_success(f'task log {task} "Checked the total"', actor=worker)
        story.expect_success(f'proof make 1 --task {task} "cart.py:1 checked"', actor=worker)
