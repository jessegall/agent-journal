import hashlib
from pathlib import Path

from engine.file.file_access import FileAccess
from engine.module.source_hash import SourceHash
from engine.version.version import ENGINE_VERSION

SCHEMA_FOLDER_NAMES = ("migrations", "models", "seeders")
MANIFEST_SUFFIX = "_module.py"


class SchemaInputs:
    """The files a journal's tables and rows come from: the migrations, models (database views are declared
    there), seeders and module manifests under the source folders, and the engine version. A run of the unit tests
    takes its code text from them, so editing any other code keeps the story templates built for it, and a
    template whose build ran that code checks it itself."""

    @staticmethod
    def hash(source_folders: tuple[Path, ...]) -> str:
        digest = hashlib.sha256(".".join(map(str, ENGINE_VERSION)).encode())
        for root in sorted(set(source_folders)):
            for file in sorted(SchemaInputs.files(root)):
                content = SourceHash.file_hash(file)
                if content is not None:
                    digest.update(f"{root.name}/{file.relative_to(root).as_posix()}".encode() + b"\0" + content)
        return digest.hexdigest()

    @staticmethod
    def files(root: Path) -> list[Path]:
        return [file for file in FileAccess.rglob(root, "*.py") if file.name.endswith(MANIFEST_SUFFIX) or any(part in SCHEMA_FOLDER_NAMES for part in file.relative_to(root).parts[:-1])]
