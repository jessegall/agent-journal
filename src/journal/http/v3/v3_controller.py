import json
import os
import time
from queue import Empty
from typing import Iterator

from journal.config import Config
from journal.engine.machine import Machine
from journal.features.tasks.states.working import Working
from journal.features.voices.calling import Calling
from journal.features.voices.chosen_voice import ChosenVoice
from journal.features.voices.shipped import HISTORICAL, KNIGHTLY, PLAIN, SPORTING, STREET, Shipped
from journal.http.request import Request
from journal.http.response import Response
from journal.http.stream_response import StreamResponse
from journal.http.v3.listing import Listing
from journal.http.v3.shapers.shapers import Shapers
from journal.http.v3.v3_actions import V3Actions
from journal.http.v3.v3_events import V3Events
from journal.http.v3.v3_manifest import VERSION, V3Manifest
from journal.http.v3.v3_row import seconds
from journal.http.v3.v3_settings import V3Settings
from journal.models.environment import Environment
from journal.repositories.agents import Agents
from journal.repositories.entries import Entries
from journal.repositories.environments import Environments
from journal.repositories.not_found import NotFound
from journal.repositories.tasks import Tasks

COLOR = "#5e64c9"
BEAT = 15.0
STARTED = time.time()
LINGERS = 10.0


class V3Controller:
    """Version 3's API, answered from version 4's rows, so the viewer sees nothing changed."""

    def __init__(self, config: Config, shapers: Shapers, manifest: V3Manifest, settings: V3Settings, actions: V3Actions, environments: Environments, entries: Entries, agents: Agents, tasks: Tasks, machine: Machine, chosen: ChosenVoice) -> None:
        self.config, self.shapers, self.manifest, self.settings, self.actions = config, shapers, manifest, settings, actions
        self.environments, self.entries, self.agents, self.tasks, self.machine, self.chosen = environments, entries, agents, tasks, machine, chosen

    # the journal

    def get_manifest(self, request: Request) -> Response:
        return Response.json(self.manifest.for_environment(self.first_environment().name))

    def get_identity(self, request: Request) -> Response:
        names = [e.name for e in self.environments.all()] or ["main"]
        return Response.json({"project": self.config.root.name, "color": COLOR, "default_color": COLOR, "custom_color": "", "root": str(self.config.home), "version": VERSION, "build": "journal-4", "pid": os.getpid(), "environments": names})

    def post_identity(self, request: Request) -> Response:
        return self.get_identity(request)

    def get_summary(self, request: Request) -> Response:
        environments = [self.environment_summary(e) for e in (self.environments.all() or [self.environments.named("main")])]
        return Response.json({"project": self.config.root.name, "root": str(self.config.home), "version": VERSION, "start": environments[0]["name"], "started": STARTED, "color": COLOR,
                              "environments": environments, "countdown": 0, "updating": False, "ready": True, "helpers": [], "tickets": [], "step": ""})

    def environment_summary(self, environment: Environment) -> dict:
        live = self.agents.live(environment.id)
        agent = {"status": "stopped", "provider": "claude", "model": "", "context": 0, "uses": 0, "started": 0, "at": 0, "tool": "", "file": "", "asking": False, "background_run": "", "says": "", "doing": ""}
        work = None
        if live:
            row = self.shapers.named("agent").row(live, list(reversed(self.entries.of_kind_in(environment.id, 200))))
            d = row.data
            agent = {"status": d["status"], "provider": live.provider or "claude", "model": "", "context": live.context_mark, "uses": 0, "started": d["started"], "at": d["at"], "tool": d["tool"], "file": "", "asking": bool(d["asking"]), "background_run": "", "says": d["last_message"], "doing": d["doing"]}
            state = self.machine.states.named(live.state, live.data)
            if isinstance(state, Working):
                try:
                    task = self.tasks.find(state.task_id)
                    work = {"n": task.id, "title": task.title, "todo": task.id, "parked": False, "awaiting": ""}
                except NotFound:
                    work = None
        open_questions = len([q for q in self.shapers.named("question").rows(environment) if q.is_open])
        return {"name": environment.name, "agent": agent, "work": work, "kind": "main", "helpers": [], "tickets": [], "plans": [], "last": None, "counts": {"questions": open_questions, "prompts": 0, "routed": 0}}

    def get_agents(self, request: Request) -> Response:
        online = []
        for environment in self.environments.all():
            live = self.agents.live(environment.id)
            if live:
                online.append({"session": live.session, "provider": live.provider or "claude", "model": "", "status": "idle", "environment": environment.name, "at": seconds(live.updated_at), "terminal": ""})
        return Response.json(online)

    def get_pages(self, request: Request) -> Response:
        return Response.json([])

    def get_journals(self, request: Request) -> Response:
        return Response.json([{"port": self.config.port, "project": self.config.root.name, "version": VERSION, "root": str(self.config.home), "current": True, "running": True}])

    def get_health(self, request: Request) -> Response:
        return Response.json({"answering": True})

    def get_new_feature(self, request: Request) -> Response:
        return Response.json({})

    def get_empty_list(self, request: Request) -> Response:
        return Response.json([])

    def get_empty(self, request: Request) -> Response:
        return Response.json({})

    # the bar: what the live agent is doing, from its latest tool calls

    def get_bar(self, request: Request) -> Response:
        environment = self.environment_of(request)
        live = self.agents.live(environment.id)
        if not live:
            return Response.json({"queue": []})
        recent = [e for e in reversed(self.entries.of_kind_in(environment.id, 60)) if e.actor and e.actor.id == live.session and e.kind in ("ToolStarting", "ToolFinished")]
        queue, open_ = [], {}
        for e in recent:
            tool = e.data.get("tool_name", "")
            command = e.data.get("tool_input", {}).get("command", "") if tool == "Bash" else e.data.get("tool_input", {}).get("file_path", "")
            key = f"{tool} {command}".strip()
            at = seconds(e.created_at)
            if e.kind == "ToolStarting":
                item = {"id": at, "key": key, "parts": [{"value": tool.lower() or "working", "color": "gray"}, *([{"value": command[:80], "color": "muted"}] if command else [])], "at": at, "done": False, "for": 0, "clock": True, "hold": 0.25, "lingers": LINGERS}
                queue.append(item)
                open_[key] = item
            elif key in open_:
                open_[key].update(done=True, **{"for": max(0.0, at - open_[key]["at"])})
        return Response.json({"queue": queue[-8:]})

    # settings

    def get_settings(self, request: Request) -> Response:
        return Response.json(self.settings.tree(self.environment_of(request).id))

    def post_settings(self, request: Request) -> Response:
        return Response.json(self.settings.save(request.body, request.actor))

    # rows

    def get_list(self, request: Request) -> Response:
        shaper = self.shapers.named(request.params["type"])
        if shaper is None:
            return Response.not_found(request.params["type"])
        return Response.json(Listing.from_query(request.query).listed(shaper.rows(self.environment_of(request))))

    def get_one(self, request: Request) -> Response:
        shaper = self.shapers.named(request.params["type"])
        n = int(request.params["n"])
        row = next((r for r in (shaper.rows(self.environment_of(request)) if shaper else []) if r.n == n), None)
        return Response.json(row.to_json()) if row else Response.not_found(f"no {request.params['type']} {n}")

    def get_choices(self, request: Request) -> Response:
        return Response.json([])

    def get_dashboard(self, request: Request) -> Response:
        environment = self.environment_of(request)
        wanted = [t for t in request.query.get("types", "").split(",") if t]
        listing = Listing.from_query({**request.query, "completed": "true"})
        rows, counts = {}, {}
        for shaper in (self.shapers.named(t) for t in self.shapers.types()):
            all_rows = shaper.rows(environment)
            open_rows = [r for r in all_rows if r.is_open]
            counts[shaper.type] = {"all": len(all_rows), "open": len(open_rows), "unread": len([r for r in open_rows if "user" not in r.seen])}
            if shaper.type in wanted:
                rows[shaper.type] = listing.listed(all_rows)
        answer = {"rows": rows, "counts": counts}
        if "events" in request.query:
            answer["events"] = self.events_since(environment, 0, int(request.query.get("events") or 100))
            answer["settings"] = self.settings.tree(environment.id)
        return Response.json(answer)

    def post_create(self, request: Request) -> Response:
        environment = self.environment_of(request)
        made = self.actions.create(request.params["type"], environment, request.body, request)
        if made is None:
            return Response.refused(f"the viewer cannot make a {request.params['type']} here")
        return Response.json(self.row_of(request.params["type"], made.id, environment), 201)

    def post_act(self, request: Request) -> Response:
        environment = self.environment_of(request)
        type_, n, action = request.params["type"], int(request.params["n"]), request.params["action"]
        try:
            done = self.actions.act(type_, n, action, request.body, request)
        except NotFound as missing:
            return Response.not_found(str(missing))
        if done is None:
            return Response.refused(f"{action} is not something the viewer can do to a {type_} here")
        return Response.json(self.row_of(type_, n, environment) or {})

    def post_read_all(self, request: Request) -> Response:
        self.actions.read_all(request.params["type"], [int(n) for n in request.body.get("numbers", [])], request.actor)
        return Response.json({})

    def post_type_action(self, request: Request) -> Response:
        """A command on a type rather than a row: the voice page's lookups, and the organization the board asked for."""
        type_, action = request.params["type"], request.params["action"]
        if type_ == "profile" and action == "callings":
            return Response.json({c.value: c.called(self.chosen.title(), self.chosen.first_name()) for c in Calling if c is not Calling.OWN})
        if type_ == "profile" and action == "samples":
            return Response.json({str(n): v.sample.replace("{you}", v.calling.called(self.chosen.title(), self.chosen.first_name(), v.address) or "you") for n, v in enumerate(Shipped.ALL, 1)})
        if type_ == "profile" and action == "namings":
            return Response.json([{"label": label, "text": text} for label, text in (("Historical figures", HISTORICAL), ("Street nicknames", STREET), ("First name and role", PLAIN), ("Sporting names", SPORTING), ("Knights of the realm", KNIGHTLY))])
        if type_ == "ticket" and action == "organization":
            return Response.json({"domains": []})
        if type_ == "ticket" and action == "todos":
            return Response.json([])
        if type_ == "profile" and action == "choose":
            return self.post_settings(Request(request.method, request.path, request.query, {"form_of_address": {"profile": request.body.get("n")}}, request.params, request.headers, request.actor))
        return Response.refused(f"{action} on {type_} is not something the viewer can do here")

    def get_project_files(self, request: Request) -> Response:
        """One folder of the project, folders first, as the Code page lists it."""
        folder = request.query.get("folder", "").strip("/")
        root = (self.config.root / folder).resolve()
        if not str(root).startswith(str(self.config.root.resolve())) or not root.is_dir():
            return Response.json([])
        entries = sorted(root.iterdir(), key=lambda p: (not p.is_dir(), p.name.lower()))
        return Response.json([{"path": str(p.relative_to(self.config.root)), "name": p.name, "folder": p.is_dir()} for p in entries if not p.name.startswith(".") and p.name != "node_modules"])

    def post_console(self, request: Request) -> Response:
        return Response.json({"queued": False})

    def get_agent_edits(self, request: Request) -> Response:
        return Response.json({"cursor": time.time(), "edits": []})

    def get_agent_terminal(self, request: Request) -> Response:
        return Response.json({"lines": []})

    def get_agent_transcript(self, request: Request) -> Response:
        return Response.json({"turns": [], "rows": [], "more": False})

    # events

    def get_events(self, request: Request) -> Response:
        environment = self.environment_of(request)
        since = int(request.query.get("since", 0) or 0)
        return Response.json(self.events_since(environment, since, int(request.query.get("last", 0) or 0)))

    def events_since(self, environment: Environment, since: int, last: int = 0) -> list[dict]:
        entries = self.entries.since(environment.id, since) if since else list(reversed(self.entries.of_kind_in(environment.id, last or 100)))
        agent_n = {a.session: a.id for a in self.agents.in_(environment.id)}
        found = [V3Events.of(e, environment.name, agent_n.get(e.actor.id if e.actor else "", 0)) for e in entries]
        return [e for e in found if e]

    def get_stream(self, request: Request) -> StreamResponse:
        environment = self.environment_of(request)

        def chunks() -> Iterator[bytes]:
            yield b": open\n\n"
            last = self.entries.last_id(environment.id)
            quiet = 0.0
            while True:
                time.sleep(0.5)
                quiet += 0.5
                fresh = self.entries.since(environment.id, last)
                for entry in fresh:
                    last = entry.id
                    event = V3Events.of(entry, environment.name)
                    if event:
                        quiet = 0.0
                        yield f"id: {event['id']}\ndata: {json.dumps(event)}\n\n".encode()
                if quiet >= BEAT:
                    quiet = 0.0
                    yield b"event: beat\ndata: keep\n\n"
        return StreamResponse("text/event-stream", chunks())

    # helpers

    def environment_of(self, request: Request) -> Environment:
        return self.environments.named(request.params.get("env") or request.environment)

    def first_environment(self) -> Environment:
        return (self.environments.all() or [self.environments.named("main")])[0]

    def row_of(self, type_: str, n: int, environment: Environment) -> dict | None:
        shaper = self.shapers.named(type_)
        row = next((r for r in (shaper.rows(environment) if shaper else []) if r.n == n), None)
        return row.to_json() if row else None
