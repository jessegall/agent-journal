from pathlib import Path
from collections.abc import Sequence

from core.base.file_access import FileAccess
from core.base.module.module import Module
from core.base.profile.model_tier import ModelTier
from core.base.provider.program_model import ProgramModel
from core.base.provider.program_server_file import ProgramServerFile
from core.base.provider.tool_server import ToolServer
from tests.unit.core.base.samples.program_sample import SampleProgram


class SampleServerFile(ProgramServerFile):
    """A sample program's list of installed servers."""

    def names(self) -> set[str]:
        return set(FileAccess.shared().read(self.path).splitlines()) if self.path.is_file() else set()

    def write(self, servers: Sequence[ToolServer], dropped: Sequence[str]) -> None:
        self.path.parent.mkdir(parents=True, exist_ok=True)
        FileAccess.shared().write(self.path, "\n".join(server.name for server in servers))


class ThirdProgram(SampleProgram):
    """A sample provider with its own models, home and configuration files."""

    models = [ProgramModel("sample-fast", ModelTier.FAST), ProgramModel("sample-general", ModelTier.GENERAL)]
    worktree_hook_files = tuple([Path(".sample/hooks.json")])

    def readable_folders(self) -> tuple[Path, ...]:
        return tuple([self.folders.folder("SAMPLE_HOME", ".sample")])

    def server_files(self, folder: Path) -> tuple[ProgramServerFile, ...]:
        return tuple([SampleServerFile(folder / ".sample/servers")])


class ThirdProgramModule(Module):
    """Adds the third provider used by the program choice story."""

    name = "sample.third-program"
    requires_core = ">=5,<6"
    providers = [ThirdProgram]
