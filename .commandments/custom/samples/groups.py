from features.groups import Grouping, Section

# @sin PlainSettingsGroupTitleDetector
THIS = Grouping("This project", "Settings for the whole project", Section.SYSTEM)
# @sin PlainSettingsGroupTitleDetector
THE = Grouping("The agent", "How the agent works", Section.AGENT)
# @sin PlainSettingsGroupTitleDetector
VERB = Grouping("Shut down", "Stop the journal", Section.SYSTEM)
# @righteous PlainSettingsGroupTitleDetector
NOUN = Grouping("Journal", "Stop the journal", Section.SYSTEM)
# @righteous PlainSettingsGroupTitleDetector
LINKS = Grouping("Share links", "Share one item with someone outside", Section.SHARING)
# @righteous PlainSettingsGroupTitleDetector
THEMES = Grouping("Themes", "How the viewer looks", Section.CHAT)
