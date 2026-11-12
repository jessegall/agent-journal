from core.modules.processes.models.process import Process


class ProcessKindLimits:
    """How many runs of a process's kind may run at once; a kind nobody declares has no limit of its own. A
    module that declares kinds of run, such as the plugins module, binds its own answer."""

    def limit(self, process: Process) -> int | None:
        return None
