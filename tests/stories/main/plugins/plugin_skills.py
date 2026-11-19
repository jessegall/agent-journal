from journal.features.tasks.states.ready import Ready
from journal.features.workers.workers_options import BUILDER_MODE
from journal.support.agent_role import AgentRole
from tests.stories.builder.story_marks import story
from tests.stories.fixtures.main.installed_plugin import InstalledPlugin

SKILL = "echo-guide"
JOURNAL_SKILL = "journal"
HOMES = (".claude/skills", ".agents/skills")


@story(InstalledPlugin, mode=BUILDER_MODE, subject=AgentRole.MAIN)
def test_a_plugins_skills_are_published_stamped_go_when_it_is_switched_off_and_come_back_when_on(story):
    for home in HOMES:
        story.expect_project_file(f"{home}/{SKILL}/SKILL.md", f"---\nplugin: {story.plugins.first}\nname: {SKILL}\n")
        story.expect_project_file(f"{home}/{SKILL}/.gitignore", "*")
    story.user_types(f"plugin disable {story.plugins.first}")
    for home in HOMES:
        story.expect_no_project_file(f"{home}/{SKILL}")
    story.user_types(f"plugin enable {story.plugins.first}")
    for home in HOMES:
        story.expect_project_file(f"{home}/{SKILL}/SKILL.md")
    story.expect_stack(story.agents.subject, Ready)


@story(InstalledPlugin, mode=BUILDER_MODE, subject=AgentRole.MAIN)
def test_a_plugin_removed_takes_its_skills_away(story):
    story.user_types(f"plugin remove {story.plugins.first}")
    for home in HOMES:
        story.expect_no_project_file(f"{home}/{SKILL}")
    story.expect_stack(story.agents.subject, Ready)


@story(InstalledPlugin, mode=BUILDER_MODE, subject=AgentRole.MAIN)
def test_setup_brings_back_a_plugin_skill_and_a_journal_skill_lost_from_their_folders(story):
    story.project_folder_lost(f"{HOMES[1]}/{SKILL}")
    story.project_folder_lost(f"{HOMES[0]}/{JOURNAL_SKILL}")
    story.user_types("setup")
    for home in HOMES:
        story.expect_project_file(f"{home}/{SKILL}/SKILL.md", f"plugin: {story.plugins.first}")
        story.expect_project_file(f"{home}/{JOURNAL_SKILL}/SKILL.md")
    story.expect_stack(story.agents.subject, Ready)


@story(InstalledPlugin, mode=BUILDER_MODE, subject=AgentRole.MAIN)
def test_setup_replaces_a_dangling_link_where_a_plugin_skill_belongs(story):
    for home in HOMES:
        story.project_link_dangling(f"{home}/{SKILL}")
    story.user_types("setup")
    for home in HOMES:
        story.expect_project_file(f"{home}/{SKILL}/SKILL.md", f"plugin: {story.plugins.first}")
    story.expect_stack(story.agents.subject, Ready)
