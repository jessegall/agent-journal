from journal.features.profiles.support.profiles_data import ProfilesData
from journal.providers.support.profile_kind import ProfileKind
from journal.models.agent import Agent
from journal.features.profiles.support.profile_files import ProfileFiles


class ProfilesDataReader:
    """Reads the profiles feature's part of the feature data for an agent."""

    def __init__(self, files: ProfileFiles) -> None:
        self.files = files

    def read(self, agent: Agent) -> ProfilesData:
        shown = self.files.read_all()
        return ProfilesData(names=tuple(self.files.names()), subagents=tuple(p["name"] for p in shown if p["kind"] != ProfileKind.WORKER), workers=tuple(p["name"] for p in shown if p["kind"] == ProfileKind.WORKER))
