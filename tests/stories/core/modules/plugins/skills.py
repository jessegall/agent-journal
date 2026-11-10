import pytest
import json
import socket
import sys
import threading
from pathlib import Path

from engine.actor.actor import Actor
from engine.command.bus import Bus
from core.base.driver.command_category import CommandCategory
from core.modules.skills.commands.load_skill.load_skill import LoadSkill
from core.modules.skills.support.skill_catalogue import SkillCatalogue
from core.modules.skills.support.skill_requirement import SkillRequirement
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from engine.query.queries import Queries
from core.modules.plugins.support.plugin_socket_paths import PluginSocketPaths
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.skills.models.agent_skill import AgentSkill
from core.modules.skills.models.enums.agent_skill_state import AgentSkillState
from tests.stories.core.modules.plugins.hooks import LISTING_SAMPLE, installed_story
from tests.stories.core.modules.plugins.support.notices import expect_plugin_notice
from tests.stories.core.modules.skills.due import expect_countdown
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from tests.stories.core.modules.plugins.support.event_stories import SECOND_JOB, TASK_CREATED, EventPluginStarted, event_folder, event_plugin_story, plugin_row, script_calls
from tests.stories.core.modules.plugins.support.plugin_samples import SKILL
from tests.stories.core.modules.processes.support.process_samples import install_runner
from tests.stories.core.support.scanned_edits import scanned_edit
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker, repository_environment
from tests.stories.support.story_checks import expect_value

GIT_REMOTE_SAMPLE = HookSamples.shell("git fetch", ShellPart("git", CommandCategory.VERSION_CONTROL, ["fetch"]))
UPLOAD_SAMPLE = HookSamples.shell("git push", ShellPart("git", CommandCategory.VERSION_CONTROL, ["push"]))
RULES_REQUEST = f"""'{sys.executable}' -c '
import json, sys
answer = {{"v": 1}}
if "sample-rules" not in json.loads(sys.argv[1])["skills"]:
    answer.update(tell="cart.py has a sin", require_skills=["sample-rules"])
print(json.dumps(answer))
' "$line" """
SECOND_PLUGIN_SKILL_SCRIPT = """echo '{"v": 1, "require_skills": ["not-published-here"]}'"""


def test_the_skills_due_when_a_plugins_answer_requires_a_skill_count_down_from_the_session_start_and_then_hold_the_next_tool(new_story):
    story = installed_story(new_story)
    story.container.bind(SkillRequirement, SkillRequirement())
    story.hook("s-1", UPLOAD_SAMPLE)
    story.run_listeners()
    for remaining in (2, 1, 0):
        expect_countdown(story, HookSamples.edit("src/cart.py"), "journal", remaining)
    story.expect_hook_refusal("s-1", HookSamples.edit("src/cart.py"), "load this first")


def skill_digest(story, name):
    return next(skill.digest for skill in story.container.get(SkillCatalogue).skills() if skill.folder == name)


def mark_rules_loaded(story, digest):
    story.container.get(Bus).run(LoadSkill(story.agent.id, "sample-rules", digest), Actor.core(), environment_id=1)


def test_s41_a_compaction_resets_the_skills_and_the_next_event_lists_none(new_story):
    story = installed_story(new_story)
    mark_rules_loaded(story, skill_digest(story, "sample-rules"))
    expect_plugin_notice(story, GIT_REMOTE_SAMPLE, "[plugin sample] the rules are loaded")
    story.hook("s-1", HookSamples.sample("compact"))
    story.run_listeners()
    expect_plugin_notice(story, GIT_REMOTE_SAMPLE, "[plugin sample] the rules are not loaded")


def rules_plugin(new_story, **manifest):
    story = install_runner(new_story(fixture=EventPluginStarted))
    folder = event_folder(story, skills="skills", **manifest)
    (folder / "skills" / "sample-rules").mkdir(parents=True)
    (folder / "skills" / "sample-rules" / "SKILL.md").write_text(SKILL)
    story.expect_success(f"plugin install {folder} --yes", actor=story.user)
    return story


def rules_state(story):
    return story.container.get(Queries).query(AgentSkill).filter(skill="sample-rules").first().state


def start_service_socket(path: Path, lines: list[str]) -> socket.socket:
    path.parent.mkdir(parents=True, exist_ok=True)
    server = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
    server.bind(str(path))
    server.listen()

    def answer() -> None:
        while True:
            try:
                connection, _ = server.accept()
            except OSError:
                return
            line = connection.makefile().readline()
            if line:
                lines.append(line)
                connection.sendall(b'{"v": 1}\n')
            connection.close()
    threading.Thread(target=answer, daemon=True).start()
    return server


def test_s41_the_skills_reach_an_answering_service(new_story):
    story = rules_plugin(new_story, program="see.sh", hears=["command_starting"], holds=[{"event": "command_starting", "window_ms": 5000}], services=[{"name": "answers", "command": ["see.sh"], "answers": True}])
    story.run("setting set journal.core.plugins.hold_window_ms 5000 --project", actor=story.user)
    mark_rules_loaded(story, skill_digest(story, "sample-rules"))
    lines: list[str] = []
    server = start_service_socket(story.container.get(PluginSocketPaths).answers("events", "answers"), lines)
    try:
        story.hook("s-1", LISTING_SAMPLE)
    finally:
        server.close()
    story.expect_rows(len(lines) == 1)
    story.expect_rows("sample-rules" in json.loads(lines[0])["skills"])


def test_s44_a_plugin_asks_for_a_missing_skill_once_and_then_sends_neither_line_nor_skill(new_story):
    story = rules_plugin(new_story, scripts={"judge.sh": RULES_REQUEST}, program="judge.sh", hears=["file_edited"])
    scanned_edit(story, "s-1", "cart.py")
    story.run_listeners()
    story.expect_rows(rules_state(story) == AgentSkillState.DUE)
    mark_rules_loaded(story, skill_digest(story, "sample-rules"))
    expect_plugin_notice(story, LISTING_SAMPLE, "[plugin events] cart.py has a sin")
    scanned_edit(story, "s-1", "cart.py")
    story.run_listeners()
    calls = script_calls(story, "judge.sh")
    story.expect_rows(len(calls) == 2)
    story.expect_rows("sample-rules" not in calls[0]["skills"], "sample-rules" in calls[1]["skills"])
    first_lines = {row.id for row in story.container.get(Queries).query(AgentLine).all_rows()}
    story.hook("s-1", LISTING_SAMPLE)
    last_lines = {row.id for row in story.container.get(Queries).query(AgentLine).all_rows()}
    expect_value(last_lines, first_lines)
    story.expect_rows(rules_state(story) == AgentSkillState.LOADED)


def test_s44_a_skill_the_plugin_does_not_publish_is_ignored(new_story):
    story = event_plugin_story(new_story, scripts={"asks.sh": SECOND_PLUGIN_SKILL_SCRIPT}, program="asks.sh", hears=["file_edited"])
    scanned_edit(story, "s-1", "cart.py")
    story.run_listeners()
    story.expect_rows(len(script_calls(story, "asks.sh")) == 1)
    story.expect_rows(story.container.get(Queries).query(AgentSkill).filter(skill="not-published-here").first() is None)


@pytest.mark.real_git
def test_disabling_a_plugin_unlinks_a_worktree_skill_without_removing_its_target(new_story, tmp_path):
    story = installed_story(new_story)
    repository_environment(story)
    story.expect_success('task make "Fix the cart" --environment main', actor=story.agent)
    worker = dispatched_worker(story)
    worktree = story.container.get(WorktreeQuery).worker_worktree(worker.id)
    target = tmp_path / "linked-skill"
    target.mkdir()
    skill = target / "SKILL.md"
    skill.write_text("---\nplugin: sample\nname: linked-rules\n---\nKeep this.\n")
    link = Path(worktree.folder) / ".claude" / "skills" / "linked-rules"
    link.parent.mkdir(parents=True, exist_ok=True)
    link.symlink_to(target, target_is_directory=True)
    story.expect_success("plugin disable sample", actor=story.user)
    story.expect_rows(not link.is_symlink(), skill.read_text().endswith("Keep this.\n"))
