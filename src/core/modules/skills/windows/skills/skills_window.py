from engine.viewer.window import Window
from core.modules.skills.support.skeletons import SKILLS_SKILLS_SKELETON
from core.modules.skills.support.skills_window_lines import SKILLS_EVENTS
from core.modules.skills.support.skills_window_lines import SKILLS_READS
from core.modules.skills.support.skills_window_lines import SKILLS_RUNS
from engine.enums.window_icon import WindowIcon
from engine.enums.window_loading import WindowLoading
from engine.enums.window_place import WindowPlace
from engine.viewer.window_read_search import WindowReadSearch
from core.modules.skills.windows.skills.keys.catalogue_key import CatalogueKey
from core.modules.skills.windows.skills.keys.requirements_key import RequirementsKey
from core.modules.skills.windows.skills.keys.main_agent_key import MainAgentKey
from core.modules.skills.windows.skills.keys.loaded_key import LoadedKey
from core.modules.skills.windows.skills.keys.triggers_key import TriggersKey
from core.modules.skills.windows.skills.keys.profiles_key import ProfilesKey
from core.modules.skills.windows.skills.keys.text_key import TextKey
from core.modules.skills.windows.skills.keys.agent_skill_key import AgentSkillKey
from core.modules.skills.windows.skills.keys.trial_key import TrialKey


class SkillsWindow(Window):
    """The Skills window."""

    name = "skills.skills"
    title = "Skills"
    entry = "skills.js"
    loading = WindowLoading.COMPONENT
    skeleton = SKILLS_SKILLS_SKELETON
    group = "project"
    place = WindowPlace.PAGE
    icon = WindowIcon.SKILL
    search = WindowReadSearch("skill list", "Find a skill", ("folder", "description"))
    reads = SKILLS_READS
    runs = SKILLS_RUNS
    events = SKILLS_EVENTS
    keys = [CatalogueKey, RequirementsKey, MainAgentKey, LoadedKey, TriggersKey, ProfilesKey, TextKey, AgentSkillKey, TrialKey]
