from core.modules.processes.support.part_spec import PartSpec
from core.modules.processes.support.part_visibility import PartVisibility


class WorkerPartVisibility(PartVisibility):
    """Includes a worker merge among the process parts shown in the viewer."""

    def is_visible(self, part: PartSpec) -> bool:
        return super().is_visible(part) or part.text.startswith("journal worker merge")
