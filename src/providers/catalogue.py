from pathlib import Path

from engine.worktree import WorkspaceFolders
from providers.claude import Claude
from providers.codex import Codex

PROVIDER_TYPES = (Claude, Codex)


def workspace_folders() -> WorkspaceFolders:
    return WorkspaceFolders(homes=tuple(dict.fromkeys(Path(folder).parts[0] for cls in PROVIDER_TYPES for folder in (cls.home, cls.skill_home) if folder)),
                            shared=tuple(path for cls in PROVIDER_TYPES for path in cls.shared_files),
                            shared_if_ignored=tuple(path for cls in PROVIDER_TYPES for path in cls.shared_if_ignored),
                            shared_in=tuple(cls.skill_home for cls in PROVIDER_TYPES if cls.skill_home),
                            worktrees=tuple(cls.worktrees for cls in PROVIDER_TYPES if cls.worktrees))
