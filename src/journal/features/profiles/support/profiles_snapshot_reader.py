from journal.features.profiles.support.profiles_snapshot import ProfilesSnapshot
from journal.models.agent import Agent
from journal.support.profile_files import ProfileFiles


class ProfilesSnapshotReader:
    """Reads the profiles feature's part of the Snapshot for an agent."""

    def __init__(self, files: ProfileFiles) -> None:
        self.files = files

    def read(self, agent: Agent) -> ProfilesSnapshot:
        shown = self.files.read_all()
        return ProfilesSnapshot(names=tuple(self.files.names()), subagents=tuple(p["name"] for p in shown if p["kind"] != "worker"), workers=tuple(p["name"] for p in shown if p["kind"] == "worker"))
