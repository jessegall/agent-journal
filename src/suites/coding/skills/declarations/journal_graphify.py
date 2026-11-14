from engine.skill.skill_declaration import SkillDeclaration
from suites.coding.support.graphify_tool import GRAPHIFY


class JournalGraphify(SkillDeclaration):
    """The skill journal-graphify: find code through the project's knowledge graph with graphify query,
    explain and path, using names from the code instead of questions."""

    folder = "journal-graphify"
    description = "Find code through the project's knowledge graph with graphify query, explain and path, using names from the code instead of questions; read it before you search the code while Graphify is on"
    keywords = ["graphify"]
    required_setting = GRAPHIFY.settings_key
