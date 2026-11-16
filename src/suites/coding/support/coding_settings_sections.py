from engine.viewer.settings_section import SettingsSection

AGENT_SETTINGS_WINDOW = "coding.agent-settings"
# the sections of the Settings page the agent settings window draws, a tab or two for each, and the modules whose settings it draws
CODING_SETTINGS_SECTIONS = [
    SettingsSection("workers", "Workers", "work", AGENT_SETTINGS_WINDOW, ("work",), next_section="reviews",
                    draws_modules=("journal.suites.coding", "journal.suites.coding.workers", "journal.core.helpers")),
    SettingsSection("helpers", "Helpers", "agents", AGENT_SETTINGS_WINDOW, ("agents", "assign"), next_section="tools"),
    SettingsSection("tests", "Tests", "todos", AGENT_SETTINGS_WINDOW, ("tests",), next_section="tools"),
    SettingsSection("advanced", "Advanced", "layout", AGENT_SETTINGS_WINDOW, ("advanced",)),
]
