from engine.command.context import Context
from engine.event.changed import Changed
from engine.listener.save_listener import SaveListener
from engine.registry.registry import Registry
from core.modules.drivers.support.answer_basis_writers import AnswerBasisWriters
from core.modules.settings.models.setting import Setting


class DrivingSettingBasisListener(SaveListener[Changed[Setting]]):
    """A setting declared as driving, and the driver or suite chosen, moves the driver
    epoch of its environment in the same write, and of every environment when it is the project's."""

    name = "drivers.driving-setting-basis"

    def __init__(self, registry: Registry, writers: AnswerBasisWriters) -> None:
        self.registry, self.writers = registry, writers

    def handle(self, event: Changed[Setting], context: Context) -> None:
        setting = event.row
        if not any(entry.key == setting.key and entry.is_driving for entry in self.registry.settings):
            return
        if setting.environment_id is None:
            self.writers.bump_environments(context)
            return
        self.writers.bump_environment(setting.environment_id, context)
