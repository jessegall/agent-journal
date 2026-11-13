import re
from pathlib import Path


from engine.enums.command_category import CommandCategory
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from tests.stories.core.modules.helpers.support.journal_hook_lines import journal_hook_line
from tests.stories.core.modules.helpers.support.list_workers import WORKER_SESSION, worker_story

__all__ = ["worker_story"]
from tests.stories.core.support.fixtures import MainEnvironment

SOURCE = Path(__file__).resolve().parents[5] / "src"
SAMPLES = "tests.stories.core.modules.helpers.support.command_list_samples"
COMMAND_TYPES = "journal.suites.coding.worker-command-types"
WORKER_SKILLS = ("core/modules/skills/skills/journal/SKILL.md", "core/modules/skills/skills/journal-etiquette/SKILL.md", "core/modules/tasks/skills/journal-tasks/SKILL.md",
                 "core/modules/processes/skills/journal-shell/SKILL.md", "suites/coding/modules/workers/skills/journal-worker/SKILL.md")
MAIN_AGENT_LINES = frozenset(["alias add", "alias skip", "command-type make", "reader add", "reader readable", "reader unreadable", "reader-request waive", "plan focus",
                              "refusal approve", "refusal decline", "task cancel", "task close", "task depend", "task edit", "task next"])
SKILL_LINE = re.compile(r"`journal ([a-z][a-z-]*) ([a-z][a-z-]*)")
REMOVAL = HookSamples.shell("rm src/cart.py", ShellPart("rm", "edit", ["src/cart.py"], effects=["writes_files"]))


def skill_lines() -> list[tuple[str, str]]:
    skill_words = (match.groups() for skill in WORKER_SKILLS for match in SKILL_LINE.finditer((SOURCE / skill).read_text()))
    return sorted({words for words in skill_words if " ".join(words) not in MAIN_AGENT_LINES})


def test_help_shows_a_worker_only_the_verbs_it_may_run_and_a_refused_verb_names_the_allowed_ones(worker_story):
    story, worker = worker_story
    story.expect_text("task --help", "  show", "  log", actor=worker)
    story.expect_no_text("task --help", "  assign", actor=worker)
    story.expect_refusal(f"task assign 1 --to {story.agent.id}", "A worker may not run task assign: it runs the groups proof", actor=worker)


def test_a_compound_line_is_refused_whole_naming_its_refused_part(worker_story):
    story, worker = worker_story
    line = HookSamples.shell("journal task show 1; journal setting set journal.core.helpers.accept-every-approval true",
                             ShellPart("journal", CommandCategory.JOURNAL, ["task", "show", "1"], subcommand="task"),
                             ShellPart("journal", CommandCategory.JOURNAL, ["setting", "set", "journal.core.helpers.accept-every-approval", "true"], subcommand="setting"))
    story.expect_hook_refusal(WORKER_SESSION, line.with_fields(event="pre_tool_use"), "A worker may not run setting set")


def test_a_person_changes_the_workers_shell_types_and_the_type_journal_changes_nothing(worker_story):
    story, worker = worker_story
    story.expect_success(f"""setting make {COMMAND_TYPES} '["read", "search", "journal"]' --environment main""")
    story.expect_hook_refusal(WORKER_SESSION, REMOVAL, "a worker here runs no edit command")
    story.expect_hook_allowed(WORKER_SESSION, journal_hook_line("task", "show", "1"))
    story.expect_text(f"setting show {COMMAND_TYPES}", "journal here changes nothing")


def test_after_a_sync_the_first_line_is_judged_by_the_new_list(new_story):
    story = new_story(fixture=MainEnvironment)
    story.expect_sync_success(f"{SAMPLES}:ShowingClerkSuite")
    story.expect_success("agent start c-1 claude clerk --environment main", "role: clerk")
    story.expect_hook_allowed("c-1", journal_hook_line("task", "show", "1"))
    story.expect_sync_success(f"{SAMPLES}:ListingClerkSuite")
    story.expect_hook_refusal("c-1", journal_hook_line("task", "show", "1"), "A clerk may not run task show")


def test_a_worker_runs_every_journal_line_its_skills_name_for_it(worker_story):
    story, worker = worker_story
    for group, subcommand_name in skill_lines():
        story.expect_text(f"{group} --help", f"  {subcommand_name}", actor=worker)
