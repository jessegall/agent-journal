from core.modules.processes.models.enums.notice_type import NoticeType
from core.modules.processes.models.process import Process
from core.modules.processes.models.process_part import ProcessPart
from core.modules.processes.support.cadence.cadence_notice import CadenceNotice
from core.modules.processes.agent_messages.run_frozen_message import RunFrozenMessage
from core.modules.processes.agent_messages.run_sparse_message import RunSparseMessage
from core.modules.processes.agent_messages.silent_run_message import SilentRunMessage
from core.modules.processes.agent_messages.silent_saved_packages_message import SilentSavedPackagesMessage
from core.modules.processes.agent_messages.silent_saved_run_message import SilentSavedRunMessage
from core.modules.processes.agent_messages.stalled_run_message import StalledRunMessage
from core.modules.processes.support.streaming_hints import StreamingHints


class CadenceMessages:
    """Picks the declaration of a cadence notice and its values: the output, the seconds and the hint
    of the command's tool, or the alias and the seconds for a saved command that printed nothing. No
    text of the output or of the command goes into a notice."""

    @staticmethod
    def notice(category: NoticeType, process: Process, part: ProcessPart, seconds: int, limit: int) -> CadenceNotice:
        command = part.command or part.text
        hint = StreamingHints.hint(command)
        match category:
            case NoticeType.SILENT if part.saved_command:
                declaration = SilentSavedPackagesMessage.declared() if StreamingHints.is_serial_packages_run(command) else SilentSavedRunMessage.declared()
                return CadenceNotice(declaration, {"name": part.saved_command, "seconds": seconds})
            case NoticeType.SILENT:
                return CadenceNotice(SilentRunMessage.declared(), {"output": process.id, "seconds": seconds, "hint": hint})
            case NoticeType.STOPPED_WRITING:
                return CadenceNotice(StalledRunMessage.declared(), {"output": process.id, "seconds": seconds, "hint": hint})
            case NoticeType.SPARSE:
                return CadenceNotice(RunSparseMessage.declared(), {"output": process.id, "seconds": seconds, "hint": hint})
            case NoticeType.FROZEN:
                return CadenceNotice(RunFrozenMessage.declared(), {"output": process.id, "seconds": seconds, "limit": limit})
