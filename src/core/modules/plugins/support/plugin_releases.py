import os
import re
import subprocess
from engine.enums.process_kind import ProcessKind
from engine.errors.run_time_limit_error import RunTimeLimitError
from engine.process.door.execution_request import ExecutionRequest
from engine.process.door.process_executor import ProcessExecutor
from pathlib import Path

from engine.version.version_numbers import VersionNumbers
from engine.errors.refusal import Refusal
from core.modules.plugins.support.plugin_latest import PluginLatest
from core.modules.plugins.support.plugin_manifest import PluginManifest

GIT_LIMIT_SECONDS = 20
RELEASE_TAG = re.compile(r"refs/tags/(v?\d+(?:\.\d+)*)$")
SHORT_REPOSITORY = re.compile(r"[\w.-]+/[\w.-]+")
GITHUB = "https://github.com/"


class PluginReleases:
    """Reads the newest release of a plugin's source: the version in a folder's manifest, or the highest
    version tag of a repository."""

    def __init__(self, executor: ProcessExecutor) -> None:
        self.executor = executor

    def latest(self, name: str, installed: str, source: str) -> PluginLatest:
        newest = PluginManifest.read(Path(source)).version if Path(source).is_dir() else self.newest_tag(source)
        return PluginLatest(name, installed, newest, newest is not None and VersionNumbers.parsed(newest) > VersionNumbers.parsed(installed))

    def newest_tag(self, source: str) -> str | None:
        try:
            finished = self.executor.execute(ExecutionRequest(["git", "ls-remote", "--tags", self.address(source)], Path.cwd(), ProcessKind.QUICK, GIT_LIMIT_SECONDS,
                                                              variables={**os.environ, "GIT_TERMINAL_PROMPT": "0"}))
        except RunTimeLimitError as timeout:
            raise Refusal(f"{source} did not answer within {GIT_LIMIT_SECONDS} seconds", "try again once the network is back") from timeout
        if not finished.succeeded:
            raise Refusal(f"the releases of {source} could not be read", finished.stderr.strip())
        tags = [match.group(1) for match in map(RELEASE_TAG.search, finished.stdout.splitlines()) if match]
        return max(tags, key=VersionNumbers.parsed, default=None)

    @staticmethod
    def address(source: str) -> str:
        return f"{GITHUB}{source}" if SHORT_REPOSITORY.fullmatch(source) else source
