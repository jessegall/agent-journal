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


def test_every_window_with_a_search_declares_the_placeholder_its_bar_draws(played):
    story = played(UserBuilder)
    declared = {window.name: window.search.get("placeholder") for window in Registry.read(story.container.get(Database)).windows if window.search}
    expect_value(declared, PLACEHOLDERS)




