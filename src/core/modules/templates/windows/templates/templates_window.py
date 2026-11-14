from engine.viewer.window import Window
from core.modules.templates.support.skeletons import TEMPLATES_TEMPLATES_SKELETON
from core.modules.templates.support.template_searcher import TemplateSearcher
from engine.enums.window_icon import WindowIcon
from engine.enums.window_loading import WindowLoading
from engine.enums.window_place import WindowPlace
from engine.viewer.window_search import WindowSearch
from core.modules.templates.windows.templates.keys.templates_key import TemplatesKey


class TemplatesWindow(Window):
    """The Templates window."""

    name = "templates.templates"
    title = "Templates"
    entry = "templates.js"
    loading = WindowLoading.COMPONENT
    skeleton = TEMPLATES_TEMPLATES_SKELETON
    search = WindowSearch(TemplateSearcher, "Search the templates")
    group = "project"
    place = WindowPlace.PAGE
    icon = WindowIcon.FILED
    reads = ["template list", "template show"]
    runs = ["template make", "template edit", "template send"]
    events = ["template.*"]
    keys = [TemplatesKey]
