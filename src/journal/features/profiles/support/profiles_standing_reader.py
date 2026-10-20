from journal.features.profiles.support.profiles_standing import ProfilesStanding
from journal.models.agent import Agent
from journal.support.profile_files import ProfileFiles


class ProfilesStandingReader:
    """Reads the profiles feature's part of the Standing for an agent."""

    def __init__(self, files: ProfileFiles) -> None:
        self.files = files

    def read(self, agent: Agent) -> ProfilesStanding:
        shown = self.files.read_all()
        return ProfilesStanding(names=tuple(self.files.names()), subagents=tuple(p["name"] for p in shown if p["kind"] != "worker"), workers=tuple(p["name"] for p in shown if p["kind"] == "worker"))
