from engine.container.container import Container
from engine.guard.guard import Guard
from engine.registry.registry import Registry
from engine.setting.setting_values import SettingValues
from core.modules.developer.support.developer_settings import PREVENT_LAZY_LOADING_SETTING


class BootResolve:
    """With the developer setting Prevent lazy loading on, a kept container builds every handler, guard and
    listener of its registry when it boots and is then sealed, so a class built later stops with LateResolveError."""

    @staticmethod
    def sealed(container: Container) -> None:
        if not container.get(SettingValues).project.flag(PREVENT_LAZY_LOADING_SETTING):
            return
        registry = container.get(Registry)
        for path in registry.handlers.values():
            container.get(path.loaded())
        for guard in registry.guards:
            container.get(guard.path.checked_class(Guard))
        for listener in registry.listeners:
            container.get(listener.path.loaded())
        container.seal()
