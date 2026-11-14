from engine.viewer.window import Window
from core.modules.skills.support.skeletons import SKILLS_SKILLS_SKELETON
from core.modules.skills.support.skills_window_lines import SKILLS_EVENTS
from core.modules.skills.support.skills_window_lines import SKILLS_READS
from core.modules.skills.support.skills_window_lines import SKILLS_RUNS
from engine.enums.window_icon import WindowIcon
from engine.enums.window_loading import WindowLoading
from engine.enums.window_place import WindowPlace
from core.modules.skills.windows.skill_body.keys.catalogue_key import CatalogueKey
from core.modules.skills.windows.skill_body.keys.requirements_key import RequirementsKey
from core.modules.skills.windows.skill_body.keys.main_agent_key import MainAgentKey
from core.modules.skills.windows.skill_body.keys.loaded_key import LoadedKey
from core.modules.skills.windows.skill_body.keys.triggers_key import TriggersKey
from core.modules.skills.windows.skill_body.keys.profiles_key import ProfilesKey
from core.modules.skills.windows.skill_body.keys.text_key import TextKey
from core.modules.skills.windows.skill_body.keys.agent_skill_key import AgentSkillKey
from core.modules.skills.windows.skill_body.keys.trial_key import TrialKey


class SkillBodyWindow(Window):
    """The Skill window."""

    name = "skills.skill-body"
    title = "Skill"
    entry = "skill-body.js"
    loading = WindowLoading.COMPONENT
    place = WindowPlace.SECTION
    icon = WindowIcon.SKILL
    skeleton = SKILLS_SKILLS_SKELETON
    reads = SKILLS_READS
    runs = SKILLS_RUNS
    events = SKILLS_EVENTS
    keys = [CatalogueKey, RequirementsKey, MainAgentKey, LoadedKey, TriggersKey, ProfilesKey, TextKey, AgentSkillKey, TrialKey]
