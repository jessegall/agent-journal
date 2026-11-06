from core.modules.processes.queries.output_query import OutputQuery
from core.modules.processes.support.output_folder import OutputFolder


class GrownOutputs:
    """Whether a run's output changed since its reader last looked: it gained bytes, or the runner cut it."""

    def __init__(self, outputs: OutputQuery, folder: OutputFolder) -> None:
        self.outputs, self.folder = outputs, folder

    def has_new_bytes(self, process_id: int) -> bool:
        output = self.outputs.process(process_id).limited(1)
        return bool(output) and output[0].reader_id is not None and self.folder.total_bytes(process_id) + self.folder.cut_bytes(process_id) != output[0].seen_offset
