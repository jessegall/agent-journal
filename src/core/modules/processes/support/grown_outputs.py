from core.modules.processes.queries.output_query import OutputQuery
from core.modules.processes.support.output_folder import OutputFolder


class GrownOutputs:
    """Whether a run's output changed since its reader last looked: it gained bytes, or the runner cut it."""

    def __init__(self, outputs: OutputQuery, folder: OutputFolder) -> None:
        self.outputs, self.folder = outputs, folder

    def has_new_bytes(self, process_id: int) -> bool:
        output = self.outputs.process_output(process_id)
        return output is not None and output.reader_id is not None and (self.folder.total_bytes(process_id) + self.folder.cut_bytes(process_id) != output.seen_offset
                or (self.folder.progress_count_status(process_id) is not None and not self.folder.progress_count_read(process_id)))
