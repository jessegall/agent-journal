import json
from collections import Counter
import os
import re
from pathlib import Path, PurePosixPath

from engine.file.file_access import FileAccess
from suites.coding.modules.workers.support.manifest_reading import ManifestReading
from suites.coding.modules.workers.support.project_manifest import ProjectManifest
from suites.coding.modules.workers.support.worker_test_command_entry import WorkerTestCommandEntry
from suites.coding.modules.workers.support.worktree_git import DEPENDENCY_FOLDER_NAMES

# Folders a library manager, a build or a tool fills, never a source of the project's own manifests.
LIBRARY_FOLDERS = frozenset({*DEPENDENCY_FOLDER_NAMES, ".git", ".journal", "dist", "build", "target", "__pycache__", ".idea", ".cache", ".pytest_cache",
                             ".mypy_cache", "graphify-out", ".tox", ".nox", "site-packages"})
PYTHON_MANIFESTS = ("pyproject.toml", "setup.py", "setup.cfg", "requirements.txt", "pytest.ini")
PACKAGE_JSON = "package.json"
DEFAULT_NPM_TEST = "no test specified"
ROOT = "."
NAME_LETTERS = re.compile(r"[^a-z]+")


class ProjectManifests:
    """Finds the package manifests of a project, in its root and anywhere in its source but never in a library
    folder, and reads from each the language it names and the test command a worker runs it with. Each read
    walks the folder again, so a changed or new manifest counts at once."""

    def found(self, folder: Path) -> tuple[ProjectManifest, ...]:
        read = [found for place, file_names in self.manifest_folders(folder) for found in self.read_folder(folder, place, file_names)]
        tool_counts = Counter(found.tool for found in read if found.command is not None)
        manifests: list[ProjectManifest] = []
        names: set[str] = set()
        commands: set[str] = set()
        for found in read:
            entry = self.named(found.tool, found.place, found.command, tool_counts[found.tool] == 1 or found.place == ROOT, names, commands)
            manifests.append(ProjectManifest(str(PurePosixPath(found.place) / found.file_name) if found.place != ROOT else found.file_name, found.language, entry))
        return tuple(manifests)

    @staticmethod
    def manifest_folders(folder: Path) -> list[tuple[str, list[str]]]:
        found: list[tuple[str, list[str]]] = []
        for current, folder_names, file_names in os.walk(folder):
            folder_names[:] = sorted(name for name in folder_names if name not in LIBRARY_FOLDERS and not name.startswith("."))
            place = Path(current).relative_to(folder).as_posix()
            found.append((place, sorted(file_names)))
        return found

    def read_folder(self, folder: Path, place: str, file_names: list[str]) -> list[ManifestReading]:
        read: list[ManifestReading] = []
        python_files = [name for name in PYTHON_MANIFESTS if name in file_names]
        if python_files:
            read.append(ManifestReading(place, "python", "python", f"{self.python_program(folder, place)} -m pytest", python_files[0]))
        if PACKAGE_JSON in file_names:
            read.append(self.package(folder, place))
        if "go.mod" in file_names:
            read.append(ManifestReading(place, "go", "go", "go test -count=1" if place == ROOT else f"go -C {place} test -count=1", "go.mod"))
        if "composer.json" in file_names:
            read.append(ManifestReading(place, "php", "phpunit", self.inside(place, "vendor/bin/phpunit"), "composer.json"))
        if "Cargo.toml" in file_names:
            read.append(ManifestReading(place, "rust", "cargo", "cargo test" if place == ROOT else f"cargo test --manifest-path {place}/Cargo.toml", "Cargo.toml"))
        if "Gemfile" in file_names:
            read.append(ManifestReading(place, "ruby", "rspec", "bundle exec rspec", "Gemfile"))
        project_files = [name for name in file_names if name.endswith((".csproj", ".fsproj", ".sln"))]
        if project_files:
            read.append(ManifestReading(place, "dotnet", "dotnet", "dotnet test" if place == ROOT else f"dotnet test {place}", project_files[0]))
        return read

    def package(self, folder: Path, place: str) -> ManifestReading:
        try:
            package = json.loads(FileAccess.shared().read(folder / place / PACKAGE_JSON))
        except (OSError, ValueError):
            package = {}
        package = package if isinstance(package, dict) else {}
        libraries = {**(package.get("dependencies") or {}), **(package.get("devDependencies") or {})}
        language = "typescript" if "typescript" in libraries else "javascript"
        test_script = str((package.get("scripts") or {}).get("test", ""))
        if "vitest" in libraries:
            return ManifestReading(place, language, "vitest", "npx vitest run" if place == ROOT else f"{place}/node_modules/.bin/vitest run --root {place}", PACKAGE_JSON)
        if "jest" in libraries:
            return ManifestReading(place, language, "jest", "npx jest" if place == ROOT else f"{place}/node_modules/.bin/jest --rootDir {place}", PACKAGE_JSON)
        if test_script and DEFAULT_NPM_TEST not in test_script:
            return ManifestReading(place, language, "npm", "npm test --" if place == ROOT else f"npm test --prefix {place} --", PACKAGE_JSON)
        return ManifestReading(place, language, "npm", None, PACKAGE_JSON)

    @staticmethod
    def python_program(folder: Path, place: str) -> str:
        environment = folder / place / ".venv" / "bin" / "python"
        if environment.exists():
            return ".venv/bin/python" if place == ROOT else f"{place}/.venv/bin/python"
        return "python3"

    @staticmethod
    def inside(place: str, path: str) -> str:
        return path if place == ROOT else f"{place}/{path}"

    @staticmethod
    def entry_name(tool: str, suffix: str, bare: bool) -> str:
        if bare:
            return tool
        return f"{tool}-{suffix}" if suffix else ""

    @staticmethod
    def named(tool: str, place: str, command: str | None, bare: bool, names: set[str], commands: set[str]) -> WorkerTestCommandEntry | None:
        if command is None or command in commands:
            return None
        suffix = NAME_LETTERS.sub("-", PurePosixPath(place).name.lower()).strip("-")
        name = ProjectManifests.entry_name(tool, suffix, bare)
        if not name or name in names:
            return None
        names.add(name)
        commands.add(command)
        return WorkerTestCommandEntry(name, command)
