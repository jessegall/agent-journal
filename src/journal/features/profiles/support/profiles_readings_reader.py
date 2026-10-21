from journal.features.profiles.support.profiles_readings import ProfilesReadings
from journal.models.agent import Agent
from journal.support.profile_files import ProfileFiles


class ProfilesReadingsReader:
    """Reads the profiles feature's part of the Readings for an agent."""

    def __init__(self, files: ProfileFiles) -> None:
        self.files = files

    def read(self, agent: Agent) -> ProfilesReadings:
        shown = self.files.read_all()
        return ProfilesReadings(names=tuple(self.files.names()), subagents=tuple(p["name"] for p in shown if p["kind"] != "worker"), workers=tuple(p["name"] for p in shown if p["kind"] == "worker"))
