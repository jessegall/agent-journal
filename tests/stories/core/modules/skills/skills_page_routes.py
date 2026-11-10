from tests.stories.core.modules.skills.due import drain_countdown
import pytest
from concurrent.futures import ThreadPoolExecutor

from engine.command.bus import Bus
from core.base.driver.command_category import CommandCategory
from core.modules.skills.commands.load_skill.load_skill import LoadSkill
from core.modules.skills.support.skill_catalogue import SkillCatalogue
from core.modules.skills.support.start_skills import StartSkills
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.modules.skills.support.skills_page_fixture import SkillsPageReady, SkillTriggerReady, skills_server, skills_page_story


def line(server, cookie, *arguments):
    return server.viewer_line_value(cookie, {"window": "skills.skills", "environment": "main", "line": list(arguments)})


def test_the_page_lists_project_and_plugin_skills_without_duplicate_journal_copies(skills_page_story):
    story = skills_page_story
    with skills_server(story) as server:
        cookie = server.expect_viewer_login(server.viewer_key("Ada"))
        rows = line(server, cookie, "skill", "list")["rows"]
        names = [row["folder"] for row in rows]
        story.expect_rows("project-notes" in names and "sample-plugin" in names)
        story.expect_rows(names.count("journal") == 1)
        story.expect_rows(line(server, cookie, "skill", "show", "project-notes")["text"].endswith("Read before taking notes.\n"))


@pytest.mark.parametrize("folder", ["journal", "sample-plugin", "project-notes"])
def test_one_required_switch_adds_then_removes_a_skill_from_project_lists(skills_page_story, folder):
    story = skills_page_story
    with skills_server(story) as server:
        cookie = server.expect_viewer_login(server.viewer_key("Ada"))
        line(server, cookie, "skill", "set-required", folder, "--agents", "all")
        line(server, cookie, "skill", "set-required", "journal-etiquette", "--agents", "all")
        settings = line(server, cookie, "skill", "requirements")
        story.expect_rows(folder in settings["session_start"] and "journal-etiquette" in settings["session_start"])
        story.expect_rows(folder in story.container.get(StartSkills).session_start())
        line(server, cookie, "skill", "set-required", folder, "--agents", "none")
        story.expect_rows(line(server, cookie, "skill", "requirements")["session_start"] == ["journal-etiquette"])


def test_main_only_and_compaction_choices_do_not_overwrite_other_skills(skills_page_story):
    story = skills_page_story
    with skills_server(story) as server:
        cookie = server.expect_viewer_login(server.viewer_key("Ada"))
        line(server, cookie, "skill", "set-required", "journal", "--agents", "main")
        line(server, cookie, "skill", "set-required", "project-notes", "--agents", "all", "--no-after-compaction")
        settings = line(server, cookie, "skill", "requirements")
        story.expect_rows(settings["main_agent"] == ["journal"])
        story.expect_rows(settings["session_start"] == ["project-notes"] and settings["after_compaction"] == [])


def test_environment_overrides_are_reported_while_switches_change_the_project(skills_page_story):
    story = skills_page_story
    story.expect_success('setting set journal.core.skills.session-start \'["journal"]\' --environment main')
    with skills_server(story) as server:
        cookie = server.expect_viewer_login(server.viewer_key("Ada"))
        line(server, cookie, "skill", "set-required", "project-notes", "--agents", "all")
        settings = line(server, cookie, "skill", "requirements")
        story.expect_rows(settings["environment_overrides"] and settings["session_start"] == ["project-notes"])


def test_the_page_creates_edits_filters_tries_pauses_enables_and_ends_skill_triggers(skills_page_story):
    story = skills_page_story
    with skills_server(story) as server:
        cookie = server.expect_viewer_login(server.viewer_key("Ada"))
        line(server, cookie, "trigger", "make", "cart", "--do", "skill", "--skill", "project-notes", "--match-mode", "word")
        rows = line(server, cookie, "trigger", "list", "--skill", "project-notes")["rows"]
        story.expect_rows(len(rows) == 1 and rows[0]["skill"] == "project-notes")
        story.expect_rows(line(server, cookie, "trigger", "list", "--skill", "journal")["rows"] == [])
        story.expect_rows(line(server, cookie, "trigger", "try", "cart", "a cart", "--match-mode", "word")["matches"] is True)
        story.expect_rows(line(server, cookie, "trigger", "try", "--phrases", "cart", "--sentence", "a cart", "--match-mode", "word")["matches"] is True)
        story.expect_rows(line(server, cookie, "trigger", "try", "cart", "carton", "--match-mode", "word")["matches"] is False)
        story.expect_rows(line(server, cookie, "trigger", "try", r"c\w+t", "a cart", "--match-mode", "pattern")["matches"] is True)
        line(server, cookie, "trigger", "edit", "1", "--phrases", "notes", "--name", "Read notes")
        line(server, cookie, "trigger", "pause", "1")
        story.expect_rows(line(server, cookie, "trigger", "list", "--skill", "project-notes")["rows"][0]["paused_at"])
        line(server, cookie, "trigger", "pause", "1", "--off")
        line(server, cookie, "trigger", "enable", "1")
        line(server, cookie, "trigger", "strike", "1")
        story.expect_rows(line(server, cookie, "trigger", "list", "--skill", "project-notes")["rows"] == [])


def test_read_now_requires_the_skill_for_the_main_agent_through_the_page(skills_page_story):
    story = skills_page_story
    with skills_server(story) as server:
        cookie = server.expect_viewer_login(server.viewer_key("Ada"))
        line(server, cookie, "skill", "require", str(story.agent.id), "project-notes")
        story.expect_rows(line(server, cookie, "agent-skill", "list", "--agent", str(story.agent.id))["rows"][0]["state"] == "due")


def test_a_skill_trigger_makes_a_skill_due_when_the_person_uses_its_word(new_story):
    story = new_story(fixture=SkillTriggerReady)
    story.expect_hook_allowed("s-1", HookSamples.prompt("a cart"))
    story.expect_text(f"agent-skill list --agent {story.agent.id}", "journal", "due")


@pytest.mark.parametrize("sample", [HookSamples.edit("cart.py"), HookSamples.shell("echo cart", ShellPart("echo", CommandCategory.UNKNOWN, ["cart"]))])
def test_a_skill_trigger_refuses_the_tool_then_allows_it_after_the_skill_is_read(new_story, sample):
    story = new_story(fixture=SkillTriggerReady)
    drain_countdown(story, sample, "journal")
    story.expect_hook_refusal("s-1", sample, "load this first with the Skill tool: journal")
    entry = next(skill for skill in story.container.get(SkillCatalogue).skills() if skill.folder == "journal")
    story.container.get(Bus).run(LoadSkill(story.agent.id, "journal", entry.digest), story.agent)
    story.run_listeners()
    story.expect_text(f"agent-skill list --agent {story.agent.id}", "journal", "loaded")
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


def test_read_again_uses_the_skill_reset_action_through_the_page(skills_page_story):
    story = skills_page_story
    entry = next(skill for skill in story.container.get(SkillCatalogue).skills() if skill.folder == "project-notes")
    row = story.container.get(Bus).run(LoadSkill(story.agent.id, "project-notes", entry.digest), story.agent)
    with skills_server(story) as server:
        cookie = server.expect_viewer_login(server.viewer_key("Ada"))
        line(server, cookie, "agent-skill", "reset", str(row.id))
        story.expect_rows(line(server, cookie, "agent-skill", "list", "--agent", str(story.agent.id))["rows"][0]["state"] == "due")


def test_skill_triggers_cannot_be_scheduled_or_shown_as_other_actions(skills_page_story):
    story = skills_page_story
    story.expect_refusal('trigger schedule "Read notes" --every 5 --do skill --skill project-notes', "watches words", actor=story.user)
    with skills_server(story) as server:
        cookie = server.expect_viewer_login(server.viewer_key("Ada"))
        line(server, cookie, "trigger", "make", "cart", "--do", "skill", "--skill", "project-notes")
        line(server, cookie, "trigger", "edit", "1", "--action", "nudge", "--text", "A note")
        story.expect_rows(line(server, cookie, "trigger", "list", "--skill")["rows"] == [])


def test_newest_order_has_the_file_change_date_on_every_skill(skills_page_story):
    story = skills_page_story
    with skills_server(story) as server:
        cookie = server.expect_viewer_login(server.viewer_key("Ada"))
        rows = line(server, cookie, "skill", "list")["rows"]
        story.expect_rows(all(isinstance(row["modified_at"], int) and row["modified_at"] > 0 for row in rows))


def test_two_quick_switches_keep_both_skills_in_the_project_lists(skills_page_story):
    story = skills_page_story
    with skills_server(story) as server:
        cookie = server.expect_viewer_login(server.viewer_key("Ada"))
        with ThreadPoolExecutor(max_workers=2) as requests:
            changes = [requests.submit(line, server, cookie, "skill", "set-required", folder, "--agents", "all") for folder in ("journal", "project-notes")]
            for change in changes:
                change.result()
        story.expect_rows(set(line(server, cookie, "skill", "requirements")["session_start"]) == {"journal", "project-notes"})


def test_a_required_plugin_skill_is_due_at_start_and_after_compaction(skills_page_story):
    story = skills_page_story
    with skills_server(story) as server:
        cookie = server.expect_viewer_login(server.viewer_key("Ada"))
        line(server, cookie, "skill", "set-required", "sample-plugin", "--agents", "all")
    story.hook("s-1", HookSamples.session_start())
    story.run_listeners()
    story.expect_text(f"agent-skill list --agent {story.agent.id}", "sample-plugin", "due")
    entry = next(skill for skill in story.container.get(SkillCatalogue).skills() if skill.folder == "sample-plugin")
    story.container.get(Bus).run(LoadSkill(story.agent.id, "sample-plugin", entry.digest), story.agent)
    story.hook("s-1", HookSamples.sample("compact"))
    story.hook("s-1", HookSamples.session_start())
    story.run_listeners()
    story.expect_text(f"agent-skill list --agent {story.agent.id}", "sample-plugin", "due")


def test_two_matching_triggers_for_one_skill_do_not_repeat_its_requirement(new_story):
    story = new_story(fixture=SkillTriggerReady)
    story.expect_success('trigger make cart --do skill --skill journal --match-mode word', actor=story.user)
    drain_countdown(story, HookSamples.edit("cart.py"), "journal")
    story.expect_hook_refusal("s-1", HookSamples.edit("cart.py"), "load this first with the Skill tool: journal")
    story.expect_text(f"agent-skill list --agent {story.agent.id}", "journal", "due")
