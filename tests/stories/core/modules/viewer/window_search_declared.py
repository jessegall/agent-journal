from engine.database.database import Database
from engine.registry.registry import Registry
from tests.stories.core.support.coding_fixtures import UserBuilder
from tests.stories.support.story_checks import expect_value

PLACEHOLDERS = {
    "tasks.tasks": "Search the tasks",
    "dumps.dumps": "Search the dumps",
    "memories.memories": "Search the memories",
    "templates.templates": "Search the templates",
    "transcriptions.transcriptions": "Search the transcriptions",
    "documents.documents": "Search titles and abstracts",
    "documents.page": "Search titles and abstracts",
    "checks.checks": "Search the checks",
    "agents.agents": "Search the agents",
    "suggestions.suggestions": "Search the suggestions",
    "processes.outputs": "Search the commands",
    "phone.phones": "Search the phones",
    "sharing.shares": "Search the links",
    "library.teams": "Search the library",
    "mcp.integrations": "Search the servers",
    "plugins.plugins": "Search the plugins",
    "reviews.reviewer": "Search the reviews",
    "coding.file-feed": "Filter files",
    "coding.file-edits": "Filter files",
    "questions.questions": "Search the questions",
    "agents.helpers": "Search the agents",
    "settings.settings": "Find a setting",
    "messages.attachments": "Search file names and their messages",
    "skills.skills": "Find a skill",
    "profiles.profiles": "Find a profile",
    "search.search": "Search the journal",
    "coding.files": "Find a file in the project",
}


def test_every_window_with_a_search_declares_the_placeholder_its_bar_draws(new_story):
    story = new_story(fixture=UserBuilder)
    declared = {window.name: window.search.get("placeholder") for window in Registry.read(story.container.get(Database)).windows if window.search}
    expect_value(declared, PLACEHOLDERS)


def test_the_tasks_window_finds_the_tasks_that_hold_the_words(new_story):
    story = new_story(fixture=UserBuilder)
    story.run('task make "Fix the cart" --environment main', actor=story.agent)
    story.run('task make "Paint the door" --environment main', actor=story.agent)
    story.expect_text("window search tasks.tasks cart", "Fix the cart", actor=story.user)
    story.expect_absent("window search tasks.tasks cart", "title: Paint the door", actor=story.user)


def test_the_agents_window_finds_the_agents_whose_session_holds_the_words(new_story):
    story = new_story(fixture=UserBuilder)
    story.expect_text("window search agents.agents s-1", f"{story.agent.id}  1  s-1  claude  main", actor=story.user)
    story.expect_absent("window search agents.agents nothing-matches", f"{story.agent.id}  1  s-1  claude  main", actor=story.user)
