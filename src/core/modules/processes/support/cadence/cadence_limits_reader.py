from engine.container.container import Container
from engine.scope.scopes import Scopes
from core.modules.processes.models.enums.process_setting import ProcessSetting
from core.modules.processes.models.support.cadence_limits import CadenceLimits
from core.modules.processes.support.process_settings import ProcessSettings


class CadenceLimitsReader:
    """Reads the cadence limits of one environment, the way the hang watch reads its limits."""

    @staticmethod
    def limits(container: Container, environment_id: int) -> CadenceLimits:
        with container.get(Scopes).read_scope((), None, environment_id):
            settings = container.get(ProcessSettings)
            return CadenceLimits(settings.integer(ProcessSetting.FIRST_OUTPUT_SECONDS), settings.integer(ProcessSetting.STOPPED_WRITING_SECONDS),
                                 settings.integer(ProcessSetting.SPARSE_SECONDS))
