import shlex
import tomllib
from pathlib import Path

from engine.driver.command_category import CommandCategory
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

SHIPPED_PROFILES = (*HELPER_PROFILES, *WORKER_PROFILES)

ROOT = Path(__file__).resolve().parents[6]
PROFILE_COMMANDS = {
    "journal-worker": tuple(["journal task --help"]),
    "journal-merger": ("journal merger next", "journal merger merge", "journal merger findings"),
    "journal-planner": ("journal plan make", "journal phase make", "journal task make", "journal doc make"),
    "journal-researcher": ("journal search find", "journal doc make", "journal report make"),
    "journal-debugger": ("journal search find", "journal task show", "journal output read"),
    "journal-plan-reviewer": ("journal plan outline", "journal phase show", "journal task show"),
    "journal-medior": ("journal task overview", "journal task log", "journal proof make", "journal worker next", "journal worker deliver"),
    "journal-senior": ("journal task overview", "journal task log", "journal proof make", "journal worker next", "journal worker deliver"),
    "journal-code-reviewer": ("journal search find", "journal task make", "journal task list", "journal doc show", "journal report make"),
    "journal-functional-designer": ("journal sequence list", "journal sequence run", "journal doc make", "journal search find"),
    "journal-designer": ("journal doc make", "journal doc show", "journal report make", "journal search find", "journal task show"),
}
PROJECT_COMMANDS = {
    "code-reviewer": ("journal search find", "journal task make", "journal task list", "journal doc show"),
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
    planner = next(profile for profile in SHIPPED_PROFILES if profile.name == "journal-planner")
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
    story.expect_success(f"agent edit {story.helper.id} --profile {profile}")
    sample = HookSamples.shell(f"journal {command}", ShellPart("journal", CommandCategory.JOURNAL, shlex.split(command), subcommand=command.split()[0])).with_fields(helper="sub-1")
    story.expect_hook_allowed("s-1", sample)
    story.expect_success(command, actor=story.helper)


def expect_helper_commands(story) -> None:
    run_helper_command(story, "journal-planner", 'doc make "Cart design" --abstract "Plan the cart" --body "Keep totals in cents."')
    run_helper_command(story, "journal-planner", 'plan make "Cart" --brief "Keep totals correct" --environment main')
    run_helper_command(story, "journal-planner", 'phase make --plan 1 "Totals" --goal "Totals use cents"')
    run_helper_command(story, "journal-planner", 'task make "Use cents" --brief "Store integer cents" --environment main')
    run_helper_command(story, "journal-researcher", 'report make "Cart findings" --abstract "Totals" --body "Totals use cents."')
    run_helper_command(story, "journal-researcher", 'doc make "Cart evidence" --abstract "Totals" --body "The cart stores cents."')
    run_helper_command(story, "journal-plan-reviewer", "plan outline 1")
    run_helper_command(story, "journal-debugger", "task show 1")
    run_helper_command(story, "code-reviewer", 'task make "Check the cents" --brief "Check integer totals" --priority critical --environment main')
    run_helper_command(story, "plan-reviewer", "plan outline 1")
    run_helper_command(story, "designer", "task show 1")


def expect_worker_commands(story) -> None:
    repository_environment(story)
    for profile in ("journal-medior", "journal-senior"):
        task = story.new_row_id(f'task make "Work for {profile}" --brief "1. Keep the total in cents" --environment main', actor=story.agent)
        worker = dispatched_worker(story, f"worker dispatch --test-command python=pytest {task} --model sonnet --profile {profile}")
        story.expect_success(f"task overview {task}", actor=worker)
        story.expect_success(f'task log {task} "Checked the total"', actor=worker)
        story.expect_success(f'proof make 1 --task {task} "cart.py:1 checked"', actor=worker)
