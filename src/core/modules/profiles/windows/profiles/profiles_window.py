from engine.viewer.window import Window
from core.modules.profiles.support.skeletons import PROFILES_PROFILES_SKELETON
from engine.enums.window_icon import WindowIcon
from engine.enums.window_loading import WindowLoading
from engine.enums.window_place import WindowPlace
from engine.viewer.window_read_search import WindowReadSearch
from core.modules.profiles.windows.profiles.keys.programs_key import ProgramsKey
from core.modules.profiles.windows.profiles.keys.profiles_key import ProfilesKey
from core.modules.profiles.windows.profiles.keys.skills_key import SkillsKey
from core.modules.profiles.windows.profiles.keys.availability_key import AvailabilityKey


class ProfilesWindow(Window):
    """The Profiles window."""

    name = "profiles.profiles"
    title = "Profiles"
    entry = "profiles.js"
    loading = WindowLoading.COMPONENT
    skeleton = PROFILES_PROFILES_SKELETON
    place = WindowPlace.PAGE
    group = "project"
    icon = WindowIcon.AGENT
    search = WindowReadSearch("profile list", "Find a profile", ("name", "description", "agent_type", "model", "codex_model"))
    reads = ["agent programs", "helper availability", "profile list", "profile skills"]
    runs = ["helper start", "helper send", "profile save", "profile reset", "profile remove"]
    keys = [ProgramsKey, ProfilesKey, SkillsKey, AvailabilityKey]
