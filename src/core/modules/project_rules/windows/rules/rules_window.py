from engine.viewer.window import Window
from core.modules.project_rules.support.skeletons import PROJECT_RULES_RULES_SKELETON
from engine.enums.window_icon import WindowIcon
from engine.enums.window_loading import WindowLoading
from engine.enums.window_place import WindowPlace
from core.modules.project_rules.windows.rules.keys.rules_key import RulesKey


class RulesWindow(Window):
    """The Rules window."""

    name = "project-rules.rules"
    title = "Rules"
    entry = "rules.js"
    loading = WindowLoading.COMPONENT
    skeleton = PROJECT_RULES_RULES_SKELETON
    place = WindowPlace.PAGE
    group = "project"
    icon = WindowIcon.RULE
    reads = ["rule list"]
    runs = ["rule approve", "rule deny", "rule edit", "rule remove"]
    events = ["rule.*"]
    keys = [RulesKey]
