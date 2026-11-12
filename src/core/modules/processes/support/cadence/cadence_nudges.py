from core.modules.processes.models.enums.notice_kind import NoticeKind
from core.modules.processes.models.process import Process
from core.modules.processes.models.process_part import ProcessPart
from core.modules.processes.support.cadence.cadence_notice import CadenceNotice
from core.modules.processes.support.process_nudges import RUN_FROZEN, RUN_SPARSE, SILENT_RUN, SILENT_SAVED_PACKAGES, SILENT_SAVED_RUN, STALLED_RUN
from core.modules.processes.support.streaming_hints import StreamingHints


class CadenceNudges:
    """Picks the declaration of a cadence notice and its values: the output, the seconds and the hint
    of the command's tool, or the alias and the seconds for a saved command that printed nothing. No
    text of the output or of the command goes into a notice."""

    @staticmethod
    def notice(kind: NoticeKind, process: Process, part: ProcessPart, seconds: int, limit: int) -> CadenceNotice:
        command = part.command or part.text
        hint = StreamingHints.hint(command)
        match kind:
            case NoticeKind.NO_OUTPUT if part.saved_command:
                declaration = SILENT_SAVED_PACKAGES if StreamingHints.is_serial_packages_run(command) else SILENT_SAVED_RUN
                return CadenceNotice(declaration, {"name": part.saved_command, "seconds": seconds})
            case NoticeKind.NO_OUTPUT:
                return CadenceNotice(SILENT_RUN, {"output": process.id, "seconds": seconds, "hint": hint})
            case NoticeKind.STOPPED_WRITING:
                return CadenceNotice(STALLED_RUN, {"output": process.id, "seconds": seconds, "hint": hint})
            case NoticeKind.SPARSE:
                return CadenceNotice(RUN_SPARSE, {"output": process.id, "seconds": seconds, "hint": hint})
            case NoticeKind.FROZEN:
                return CadenceNotice(RUN_FROZEN, {"output": process.id, "seconds": seconds, "limit": limit})
