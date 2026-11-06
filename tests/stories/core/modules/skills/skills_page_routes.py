import pytest

from core.base.command.bus import Bus
from core.base.file_access import FileAccess
from core.base.driver.command_category import CommandCategory
from core.modules.skills.commands.load_skill.load_skill import LoadSkill
from core.modules.skills.support.skill_catalogue import SkillCatalogue
from core.modules.skills.support.start_skills import StartSkills
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.modules.skills.support.skills_page_fixture import SkillsPageReady, SkillTriggerReady, skills_server, skills_page_story
from tests.stories.server.support.server_client import server_story


def line(server, cookie, *words):
    return server.viewer_line_value(cookie, {"window": "skills.skills", "environment": "main", "line": list(words)})


def test_the_page_lists_project_and_plugin_skills_without_duplicate_journal_copies(skills_page_story):
    story = skills_page_story
    with skills_server(story) as server:
        cookie = server.expect_viewer_login(server.context.viewer.login.new_key(story.user.id))
        rows = line(server, cookie, "skill", "list")["rows"]
        names = [row["folder"] for row in rows]
        assert "project-notes" in names and "sample-plugin" in names
        assert names.count("journal") == 1
        assert line(server, cookie, "skill", "show", "project-notes")["text"].endswith("Read before taking notes.\n")


@pytest.mark.parametrize("folder", ["journal", "sample-plugin", "project-notes"])
def test_one_required_switch_adds_then_removes_a_skill_from_project_lists(skills_page_story, folder):
    story = skills_page_story
    with skills_server(story) as server:
        cookie = server.expect_viewer_login(server.context.viewer.login.new_key(story.user.id))
        line(server, cookie, "skill", "set-required", folder, "--agents", "all")
        line(server, cookie, "skill", "set-required", "journal-etiquette", "--agents", "all")
        settings = line(server, cookie, "skill", "requirements")
        assert folder in settings["session_start"] and "journal-etiquette" in settings["session_start"]
        assert folder in story.container.get(StartSkills).session_start()
        line(server, cookie, "skill", "set-required", folder, "--agents", "none")
        assert line(server, cookie, "skill", "requirements")["session_start"] == ["journal-etiquette"]


def test_main_only_and_compaction_choices_do_not_overwrite_other_skills(skills_page_story):
    story = skills_page_story
    with skills_server(story) as server:
        cookie = server.expect_viewer_login(server.context.viewer.login.new_key(story.user.id))
        line(server, cookie, "skill", "set-required", "journal", "--agents", "main")
        line(server, cookie, "skill", "set-required", "project-notes", "--agents", "all", "--no-after-compaction")
        settings = line(server, cookie, "skill", "requirements")
        assert settings["main_agent"] == ["journal"]
        assert settings["session_start"] == ["project-notes"] and settings["after_compaction"] == []


def test_environment_overrides_are_reported_while_switches_change_the_project(skills_page_story):
    story = skills_page_story
    story.expect_success('setting set journal.core.skills.session-start \'["journal"]\' --environment main')
    with skills_server(story) as server:
        cookie = server.expect_viewer_login(server.context.viewer.login.new_key(story.user.id))
        line(server, cookie, "skill", "set-required", "project-notes", "--agents", "all")
        settings = line(server, cookie, "skill", "requirements")
        assert settings["environment_overrides"] and settings["session_start"] == ["project-notes"]


def test_the_page_creates_edits_filters_tries_pauses_enables_and_ends_skill_triggers(skills_page_story):
    story = skills_page_story
    with skills_server(story) as server:
        cookie = server.expect_viewer_login(server.context.viewer.login.new_key(story.user.id))
        line(server, cookie, "trigger", "make", "cart", "--do", "skill", "--skill", "project-notes", "--match-mode", "word")
        rows = line(server, cookie, "trigger", "list", "--skill", "project-notes")["rows"]
        assert len(rows) == 1 and rows[0]["skill"] == "project-notes"
        assert line(server, cookie, "trigger", "list", "--skill", "journal")["rows"] == []
        assert line(server, cookie, "trigger", "try", "cart", "a cart", "--match-mode", "word")["matches"] is True
        assert line(server, cookie, "trigger", "try", "cart", "carton", "--match-mode", "word")["matches"] is False
        assert line(server, cookie, "trigger", "try", r"c\w+t", "a cart", "--match-mode", "pattern")["matches"] is True
        line(server, cookie, "trigger", "edit", "1", "--phrases", "notes", "--name", "Read notes")
        line(server, cookie, "trigger", "pause", "1")
        assert line(server, cookie, "trigger", "list", "--skill", "project-notes")["rows"][0]["paused_at"]
        line(server, cookie, "trigger", "pause", "1", "--off")
        line(server, cookie, "trigger", "enable", "1")
        line(server, cookie, "trigger", "strike", "1")
        assert line(server, cookie, "trigger", "list", "--skill", "project-notes")["rows"] == []


def test_read_now_requires_the_skill_for_the_main_agent_through_the_page(skills_page_story):
    story = skills_page_story
    with skills_server(story) as server:
        cookie = server.expect_viewer_login(server.context.viewer.login.new_key(story.user.id))
        line(server, cookie, "skill", "require", str(story.agent.id), "project-notes")
        assert line(server, cookie, "agent-skill", "list", "--agent", str(story.agent.id))["rows"][0]["state"] == "due"


def test_a_skill_trigger_makes_a_skill_due_when_the_person_uses_its_word(new_story):
    story = new_story(fixture=SkillTriggerReady)
    story.expect_hook_allowed("s-1", HookSamples.prompt("a cart"))
    story.expect_text(f"agent-skill list --agent {story.agent.id}", "journal", "due")


@pytest.mark.parametrize("sample", [HookSamples.edit("cart.py"), HookSamples.shell("echo cart", ShellPart("echo", CommandCategory.UNKNOWN, ["cart"]))])
def test_a_skill_trigger_refuses_the_tool_then_allows_it_after_the_skill_is_read(new_story, sample):
    story = new_story(fixture=SkillTriggerReady)
    story.expect_hook_refusal("s-1", sample, "read this first:")
    entry = next(skill for skill in story.container.get(SkillCatalogue).skills() if skill.folder == "journal")
    story.container.get(Bus).run(LoadSkill(story.agent.id, "journal", entry.digest), story.agent)
    story.expect_hook_allowed("s-1", sample)


def test_a_trigger_for_a_removed_skill_does_not_block_the_agent(skills_page_story):
    story = skills_page_story
    story.expect_success('trigger make notes --do skill --skill project-notes', actor=story.user)
    (story.home.project_folder / ".agents/skills/project-notes/SKILL.md").unlink()
    story.expect_hook_allowed("s-1", HookSamples.edit("notes.py"))


def test_a_paused_or_waiting_skill_trigger_does_nothing(new_story):
    story = new_story(fixture=SkillTriggerReady)
    story.expect_success("trigger pause 1", actor=story.user)
    story.expect_hook_allowed("s-1", HookSamples.prompt("cart"))
    story.expect_absent(f"agent-skill list --agent {story.agent.id}", "journal")


def test_an_agent_made_skill_trigger_waits_for_the_person(skills_page_story):
    story = skills_page_story
    story.expect_success('trigger make cart --do skill --skill journal', actor=story.agent)
    story.expect_hook_allowed("s-1", HookSamples.prompt("cart"))
    story.expect_absent(f"agent-skill list --agent {story.agent.id}", "journal")


def test_invalid_skill_or_pattern_is_refused_without_saving_a_trigger(skills_page_story):
    story = skills_page_story
    story.expect_refusal('trigger make cart --do skill --skill gone', "gone", actor=story.user)
    story.expect_refusal('trigger try "(a+)+" aaa --match-mode pattern', "pattern", actor=story.user)
    story.expect_absent("trigger list", "cart")
