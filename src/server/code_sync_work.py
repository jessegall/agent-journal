from core.base.container import Container
from core.base.module.code_fingerprint import CodeFingerprint
from core.base.module.module_finder import ModuleFinder
from core.base.module.module_sync import ModuleSync
from core.base.registry.registry import Registry
from server.round_work import RoundWork


class CodeSyncWork(RoundWork):
    """The first round as the server starts: runs the migrations and writes the registry when the code changed,
    before any request is taken, so no hook, tick or listener reads a table its code has outgrown."""

    def run(self, container: Container) -> None:
        current = container.get(CodeFingerprint).text(container.get(ModuleFinder).modules())
        if container.get(Registry).fingerprint != current:
            container.get(ModuleSync).run()
