from engine.viewer.window import Window
from core.modules.usage.support.skeletons import USAGE_FITNESS_SKELETON
from engine.enums.window_icon import WindowIcon
from engine.enums.window_loading import WindowLoading
from engine.enums.window_place import WindowPlace
from engine.enums.window_shows import WindowShows
from core.modules.usage.windows.fitness.keys.fitness_key import FitnessKey


class FitnessWindow(Window):
    """The Fitness window."""

    name = "usage.fitness"
    title = "Fitness"
    entry = "fitness.js"
    loading = WindowLoading.COMPONENT
    skeleton = USAGE_FITNESS_SKELETON
    icon = WindowIcon.FITNESS
    place = WindowPlace.DROPDOWN
    shows = WindowShows.SELECTED_AGENT
    reads = ["usage fitness"]
    keys = [FitnessKey]
