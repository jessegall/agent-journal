from pathlib import Path

from engine.instruction.instruction_imports import INSTRUCTION_FILES
from core.modules.agents.models.agent import Agent
from suites.coding.modules.workers.support.worker_settings import WORKER_INSTRUCTION_FILES_SETTING
from core.modules.settings.bindings.support.setting_values import SettingValues
from suites.coding.modules.workers.support.worker_instruction_files import ORIGINAL_SUFFIX
from suites.coding.support.coding_helper_role import CodingHelperRole
from suites.coding.support.managed_files import ManagedFiles

ORIGINAL_FILES = tuple(f"{Path(name).stem}{ORIGINAL_SUFFIX}{Path(name).suffix}" for name in INSTRUCTION_FILES)


class JournalManagedFiles(ManagedFiles):
    """Says whether a file of a worker's worktree is one the journal itself writes there, so it is not the
    worker's edit."""

    def __init__(self, settings: SettingValues) -> None:
        self.settings = settings

    def has(self, agent: Agent, path: str) -> bool:
        return agent.role == CodingHelperRole.WORKER and path in (*INSTRUCTION_FILES, *ORIGINAL_FILES) and self.settings.flag(WORKER_INSTRUCTION_FILES_SETTING)
