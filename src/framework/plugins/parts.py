from controllers.base import CONTROLLERS
from controllers.plugins import Plugins
from framework.plugins.declared import named
from framework.parts import ActionInterceptor, Context
from resources.base import PLUGIN, SYSTEM


def forgotten(record, name: str) -> None:
    for controller in CONTROLLERS.values():
        rows = controller(record, actor=SYSTEM)
        for row in rows.rows.summaries():
            if row.plugin == name and controller.resource.type != "plugin":
                rows.force_delete(row.n)


def installed(record, name: str) -> bool:
    return named(Plugins(record, actor=SYSTEM), name) is not None


class KeepPluginRows(ActionInterceptor):
    def intercept(self, feature_context: Context, controller, n: int = 0, **_) -> None:
        if not n or controller.actor in (SYSTEM, PLUGIN):
            return None
        row = controller.load(n)
        name = row.plugin
        if name and row.data.get("locked") is True and installed(controller.record, name):
            controller._refuse(f"{controller.type} {n} belongs to the {name} plugin: it goes when the plugin is removed")
        return None
