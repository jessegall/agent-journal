from journal.features.profiles.profile_files import ProfileFiles
from journal.http.support.request import Request
from journal.support.response import Response
from journal.repositories.statistics import Statistics


class ProfileController:
    """The agent profiles page: every profile in the agents folder with how often and when last the agent dispatched it, one read whole, and one saved as written."""

    def __init__(self, files: ProfileFiles, statistics: Statistics) -> None:
        self.files, self.statistics = files, statistics

    def index(self, request: Request) -> Response:
        """Every profile with how often and when last it was dispatched, as counted when it was."""
        counted = self.statistics.under("profiles.")
        return Response.json({"profiles": [{**profile, "uses": counted.get(f"profiles.{profile['name']}.uses", 0), "last_used": counted.get(f"profiles.{profile['name']}.last_used", 0)} for profile in self.files.read_all()]})

    def one(self, request: Request) -> Response:
        name = request.params["name"]
        if not (self.files.folder() / f"{name}.md").is_file():
            return Response.not_found("no such profile")
        return Response.json(self.files.read(name))

    def save(self, request: Request) -> Response:
        body = request.body
        if not str(request.params["name"]).replace("-", "").replace("_", "").isalnum():
            return Response.refused("a profile's name is letters, digits, dashes and underscores")
        if body.get("kind", "subagent") not in ("worker", "subagent"):
            return Response.refused("a profile is a worker or a subagent")
        return Response.json(self.files.save(request.params["name"], body.get("description", "").strip(), body.get("tools", "").strip(), body.get("kind", "subagent"), body.get("model", "").strip(), body.get("body", "").strip()))

