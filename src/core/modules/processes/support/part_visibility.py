from core.modules.processes.commands.support.part_spec import PartSpec


class PartVisibility:
    """Decides which process parts appear in the viewer."""

    def is_visible(self, part: PartSpec) -> bool:
        return part.category.is_watched
