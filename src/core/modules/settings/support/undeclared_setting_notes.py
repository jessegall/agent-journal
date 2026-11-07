from core.base.module.module import Module
from core.base.module.sync_notes import SyncNotes
from core.base.registry.setting_tree import SettingTree
from core.modules.settings.support.undeclared_settings import UndeclaredSettings


class UndeclaredSettingNotes(SyncNotes):
    """A sync tells each setting row no declaration covers, once for each key, with its module and why."""

    def __init__(self, undeclared: UndeclaredSettings) -> None:
        self.undeclared = undeclared

    def lines(self, modules: tuple[type[Module], ...]) -> list[str]:
        entries = [entry for module in modules for entry in SettingTree().entries(module.name, module.settings)]
        reports = {report.key: report for report in self.undeclared.found(entries)}
        return [f"setting {report.key} ({report.module}) {report.reason}" for report in reports.values()]
