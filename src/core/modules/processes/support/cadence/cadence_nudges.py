from core.modules.processes.models.enums.notice_type import NoticeType
from core.modules.processes.models.process import Process
from core.modules.processes.models.process_part import ProcessPart
from core.modules.processes.support.cadence.cadence_notice import CadenceNotice
from core.modules.processes.nudges.run_frozen_nudge import RunFrozenNudge
from core.modules.processes.nudges.run_sparse_nudge import RunSparseNudge
from core.modules.processes.nudges.silent_run_nudge import SilentRunNudge
from core.modules.processes.nudges.silent_saved_packages_nudge import SilentSavedPackagesNudge
from core.modules.processes.nudges.silent_saved_run_nudge import SilentSavedRunNudge
from core.modules.processes.nudges.stalled_run_nudge import StalledRunNudge
from core.modules.processes.support.streaming_hints import StreamingHints


class CadenceNudges:
    """Picks the declaration of a cadence notice and its values: the output, the seconds and the hint
    of the command's tool, or the alias and the seconds for a saved command that printed nothing. No
    text of the output or of the command goes into a notice."""

    @staticmethod
    def notice(category: NoticeType, process: Process, part: ProcessPart, seconds: int, limit: int) -> CadenceNotice:
        command = part.command or part.text
        hint = StreamingHints.hint(command)
        match category:
            case NoticeType.SILENT if part.saved_command:
                declaration = SilentSavedPackagesNudge.declared() if StreamingHints.is_serial_packages_run(command) else SilentSavedRunNudge.declared()
                return CadenceNotice(declaration, {"name": part.saved_command, "seconds": seconds})
            case NoticeType.SILENT:
                return CadenceNotice(SilentRunNudge.declared(), {"output": process.id, "seconds": seconds, "hint": hint})
            case NoticeType.STOPPED_WRITING:
                return CadenceNotice(StalledRunNudge.declared(), {"output": process.id, "seconds": seconds, "hint": hint})
            case NoticeType.SPARSE:
                return CadenceNotice(RunSparseNudge.declared(), {"output": process.id, "seconds": seconds, "hint": hint})
            case NoticeType.FROZEN:
                return CadenceNotice(RunFrozenNudge.declared(), {"output": process.id, "seconds": seconds, "limit": limit})
