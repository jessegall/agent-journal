from journal.features.profiles.profile_files import ProfileFiles
from journal.http.request import Request
from journal.http.response import Response
from journal.repositories.entries import Entries


class ProfileController:
    """The agent profiles page: every profile in the agents folder with how often and when last the agent dispatched it, one read whole, and one saved as written."""

    def __init__(self, files: ProfileFiles, entries: Entries) -> None:
        self.files, self.entries = files, entries

    def index(self, request: Request) -> Response:
        uses = self.uses()
        return Response.json({"profiles": [{**profile, **uses.get(profile["name"], {"uses": 0, "last_used": 0, "last_task": ""})} for profile in self.files.read_all()]})

    def one(self, request: Request) -> Response:
        name = request.params["name"]
        if not (self.files.folder() / f"{name}.md").is_file():
            return Response.not_found("no such profile")
        return Response.json(self.files.read(name))

    def save(self, request: Request) -> Response:
        body = request.body
        if not str(request.params["name"]).replace("-", "").replace("_", "").isalnum():
            return Response.refused("a profile's name is letters, digits, dashes and underscores")
        return Response.json(self.files.save(request.params["name"], body.get("description", "").strip(), body.get("tools", "").strip(), body.get("model", "").strip(), body.get("body", "").strip()))

    def uses(self) -> dict[str, dict]:
        """Per profile, how many times the agent dispatched it and when last, from the Agent tool's calls, newest first."""
        uses: dict[str, dict] = {}
        for call in self.entries.agent_calls():
            given = call.data.get("tool_input", {})
            name = given.get("subagent_type", "")
            if not name:
                continue
            use = uses.setdefault(name, {"uses": 0, "last_used": call.created_at.timestamp(), "last_task": given.get("description", "")})
            use["uses"] += 1
        return uses
