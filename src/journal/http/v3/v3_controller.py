import json
import os
import time
from pathlib import Path
from queue import Empty
from typing import Iterator

from journal.config import Config
from journal.engine.machine import Machine
from journal.features.voices.calling import Calling
from journal.features.voices.chosen_voice import ChosenVoice
from journal.features.voices.shipped import HISTORICAL, KNIGHTLY, PLAIN, SPORTING, STREET, Shipped
from journal.http.request import Request
from journal.http.file_response import FileResponse
from journal.http.response import Response
from journal.http.stream_response import StreamResponse
from journal.http.v3.terminal_line import TerminalLine
from journal.http.v3.current_work import CurrentWork
from journal.features.registry import Registry
from journal.providers.providers import Providers
from journal.features.skills.skill_files import SkillFiles
from journal.http.v3.project_files import ProjectFiles
from journal.http.v3.shapers.shapers import Shapers
from journal.http.v3.v3_actions import V3Actions
from journal.http.v3.v3_events import V3Events
from journal.http.v3.v3_manifest import VERSION, V3Manifest
from journal.features.shell.commands.shell_command import RAN
from journal.http.v3.bar_row import BarRow
from journal.http.v3.v3_row import V3Row, seconds
from journal.http.v3.v3_settings import V3Settings
from journal.models.entry import Entry
from journal.models.environment import Environment
from journal.repositories.agents import Agents
from journal.repositories.edits import Edits
from journal.repositories.entries import Entries
from journal.repositories.messages import Messages
from journal.repositories.questions import Questions
from journal.repositories.scope import Scope
from journal.supervisor_link import SupervisorLink
from journal.repositories.environments import Environments
from journal.repositories.not_found import NotFound
from journal.repositories.tasks import Tasks

COLOR = "#5e64c9"
BEAT = 15.0
STARTED = time.time()


SILENT_AFTER = 900.0
"""Seconds a busy agent may send nothing before the viewer says it is not responding."""


class V3Controller:
    """The API the viewer speaks, answered from the journal's rows."""

    def __init__(self, config: Config, shapers: Shapers, manifest: V3Manifest, settings: V3Settings, actions: V3Actions, environments: Environments, entries: Entries, agents: Agents, tasks: Tasks, machine: Machine, chosen: ChosenVoice, messages: Messages, files: ProjectFiles, current: CurrentWork, supervisor: SupervisorLink, registry: Registry, skill_files: SkillFiles, providers: Providers, events: V3Events, scope: Scope, edits: Edits, questions: Questions) -> None:
        self.config, self.shapers, self.manifest, self.settings, self.actions = config, shapers, manifest, settings, actions
        self.messages, self.files, self.current, self.supervisor, self.registry, self.skill_files, self.providers = messages, files, current, supervisor, registry, skill_files, providers
        self.events, self.questions = events, questions
        self.edits = edits
        self.environments, self.entries, self.agents, self.tasks, self.machine, self.chosen, self.scope = environments, entries, agents, tasks, machine, chosen, scope

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
        with self.scope.of(environment.id):
            return self.summarised(environment)

    def summarised(self, environment: Environment) -> dict:
        live = self.agents.live()
        agent = {"status": "stopped", "provider": "claude", "model": "", "context": 0, "uses": 0, "started": 0, "at": 0, "tool": "", "file": "", "asking": False, "background_run": "", "says": "", "doing": ""}
        work = None
        if live:
            row = self.shapers.named("agent").row(live, list(reversed(self.entries.of_kind_in(200))))
            d = row.data
            agent = {"status": d["status"], "provider": live.provider or "claude", "model": d["model"], "context": live.context_mark, "uses": 0, "started": d["started"], "at": d["at"], "tool": d["tool"], "file": "", "asking": bool(d["asking"]), "background_run": "", "says": d["last_message"], "doing": d["doing"]}
            held = self.current.of(live)
            work = {"n": held.task.id, "title": held.task.title, "todo": held.task.id, "parked": False, "awaiting": held.awaiting} if held else None
        counts = {"questions": len(self.questions.open()), "messages": len(self.messages.unread()), "suggestions": 0, "todos": self.tasks.unfinished_count(), "prompts": 0, "routed": 0}
        silent = agent["status"] in ("busy", "working") and time.time() - agent["at"] > SILENT_AFTER
        return {"name": environment.name, "agent": agent, "work": work, "kind": "main", "helpers": [], "tickets": [], "plans": [], "last": None, "counts": counts, "silent": silent}

    def get_agents(self, request: Request) -> Response:
        online = []
        for environment in self.environments.all():
            with self.scope.of(environment.id):
                live = self.agents.live()
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
        """The status bar's queue: each tool call and each shell part the live agent ran, as it opened and as it closed."""
        live = self.agents.live()
        if not live:
            return Response.json({"queue": []})
        recent = [e for e in reversed(self.entries.of_kind_in(60)) if e.actor and e.actor.id == live.session and BarRow.is_shown(e)]
        queue, open_ = [], {}
        for row in map(BarRow.of, recent):
            if not row.ended:
                open_[row.key] = row.item()
                queue.append(open_[row.key])
            elif row.key in open_:
                open_[row.key].update(done=True, **{"for": max(0.0, row.at - open_[row.key]["at"])})
        return Response.json({"queue": queue[-8:]})

    # settings

    def get_settings(self, request: Request) -> Response:
        return Response.json(self.settings.tree())

    def post_settings(self, request: Request) -> Response:
        """The viewer keeps the answer as its whole settings tree, so a toggle answers with all of it."""
        self.settings.save(request.body, request.actor)
        return Response.json(self.settings.tree())

    def post_mode(self, request: Request) -> Response:
        self.settings.keep_mode(request.body.get("mode"), request.actor)
        return Response.json(self.settings.tree())

    # rows

    def get_one(self, request: Request) -> Response:
        shaper = self.shapers.named(request.params["type"])
        n = request.number("n")
        row = next((r for r in shaper.rows() if r.n == n), None)
        return Response.json(row.to_json()) if row else Response.not_found(f"no {request.params['type']} {n}")

    def get_choices(self, request: Request) -> Response:
        return Response.json([])

    def post_create(self, request: Request) -> Response:
        made = self.actions.create(request.params["type"], request.body, request)
        if made is None:
            return Response.refused(f"the viewer cannot make a {request.params['type']} here")
        return Response.json(self.row_of(request.params["type"], made.id), 201)

    def post_act(self, request: Request) -> Response:
        type_, action = request.params["type"], request.params["action"]
        if not request.params["n"].isdigit():
            return Response.refused(f"{action} on a {type_} by its session is not something the viewer can do here yet")
        n = request.number("n")
        try:
            done = self.actions.act(type_, n, action, request.body, request)
        except NotFound as missing:
            return Response.missing(missing)
        if done is None:
            return Response.refused(f"{action} is not something the viewer can do to a {type_} here")
        return Response.json(done if isinstance(done, V3Row) else self.row_of(type_, n) or {})

    def post_upload(self, request: Request) -> Response:
        type_, n = request.params["type"], request.number("n")
        try:
            done = self.actions.upload(type_, n, request)
        except NotFound as missing:
            return Response.missing(missing)
        if done is None:
            return Response.refused(f"a {type_} takes no files here")
        return Response.json(self.row_of(type_, n) or {})

    def get_attached_file(self, request: Request):
        found = self.actions.attachments.read(request.params["type"], request.number("n"), request.params["name"])
        return FileResponse(*found) if found else Response.not_found("no such file")

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
        if type_ == "secret" and action == "where":
            return Response.json(self.actions.own_types["secret"].where())
        if type_ == "profile" and action == "choose":
            return self.post_settings(Request(request.method, request.path, request.query, {"form_of_address": {"profile": request.body.get("n")}}, request.params, request.headers, request.actor))
        return Response.refused(f"{action} on {type_} is not something the viewer can do here")

    def get_project_files(self, request: Request) -> Response:
        return Response.json(self.files.folder(request.query.get("folder", "")))

    def get_agent_controls(self, request: Request) -> Response:
        """The pickers of the agent bar for a provider, the current choices marked."""
        provider = self.providers.named(request.params["provider"])
        current = {"model": request.query.get("model", ""), "effort": request.query.get("effort", "")}
        groups = [{**group, "current": current.get(group["key"], "")} for group in provider.controls["groups"]]
        return Response.json({"groups": groups, "note": provider.controls["note"]})

    def post_agent_control(self, request: Request) -> Response:
        """A pick in the agent bar is the provider's own command, typed into the agent as the user would."""
        provider = self.providers.named(next((a.provider for a in self.agents.everywhere() if a.session == request.params["session"]), "claude") or "claude")
        action, value = request.body.get("action", ""), request.body.get("value", "")
        choice = next((c for g in provider.controls["groups"] if g["key"] == action for c in g["choices"] if c["value"] == value), None)
        if choice is None:
            return Response.refused(f"{action} {value} is not a choice the agent bar offers")
        self.supervisor.choose(self.scope.id, choice["command"])
        return Response.json({"queued": True})

    def get_skills(self, request: Request) -> Response:
        """The journal's skills, with whether the agent asked for has read each, as the skills page lists them."""
        agent = next((a for a in self.agents.everywhere() if str(a.id) == request.query.get("agent", "")), None)
        loaded = set((agent.skills_loaded or {}).keys()) if agent else set()
        return Response.json([{"name": skill.name, "description": skill.description, "loaded": skill.name in loaded, "always": False, "stale": False, "depth": 0} for skill in self.registry.skills()])

    def get_skill(self, request: Request) -> Response:
        skill = self.registry.skill_named(request.params["name"])
        return Response.json({"name": skill.name, "description": skill.description, "text": skill.body}) if skill else Response.not_found("no such skill")

    def post_skill_load(self, request: Request) -> Response:
        skill = self.registry.skill_named(request.params["name"])
        if skill is None:
            return Response.not_found("no such skill")
        self.supervisor.type(self.scope.id, f"read the {skill.name} skill now: {self.skill_files.path(skill)}")
        return Response.json({"queued": True})

    def get_file(self, request: Request) -> Response:
        found = self.files.file(request.query.get("path", ""))
        return Response.json(found) if found else Response.not_found("no such file")

    def get_diff(self, request: Request) -> Response:
        return Response.json({"diff": self.files.diff(request.query.get("path", ""))})

    def get_project_files_find(self, request: Request) -> Response:
        return Response.json(self.files.find(request.query.get("q", "")))

    def post_console(self, request: Request) -> Response:
        return Response.json({"queued": False})

    def get_agent_edits(self, request: Request) -> Response:
        """The files the agent wrote or edited, newest last, with the lines each change added and removed, as the file edits pane draws them."""
        n = request.number("n")
        agent = next((a for a in self.agents.in_() if a.id == n), None)
        if agent is None:
            return Response.json({"cursor": time.time(), "edits": [], "older": False})
        since = request.queried("since")
        edits = [{"id": f"{e.path}@{e.at}", "path": e.path, "kind": e.kind, "at": e.at, "added": e.added, "removed": e.removed, "first_line": e.first_line, "last_line": e.last_line,
                  "rows": list(e.rows), "image": False, "command": e.command} for e in self.edits.of_agent(agent.session, since)]
        return Response.json({"cursor": time.time(), "edits": edits[-50:], "older": False})

    def get_agent_edited_file(self, request: Request) -> Response:
        path = request.query.get("id", "").split("@")[0]
        file = (self.config.root / path).resolve()
        if not str(file).startswith(str(self.config.root.resolve())) or not file.is_file():
            return Response.not_found(path)
        return Response.json({"path": path, "text": file.read_text(errors="replace")[:200000]})

    def get_agent_terminal(self, request: Request) -> Response:
        """The shell commands the agent ran, part by part, with what each printed and how long it took, as the terminal pane shows them."""
        n = request.number("n")
        agent = next((a for a in self.agents.in_() if a.id == n), None)
        if agent is None:
            return Response.json({"lines": []})
        after = request.queried("after")
        ran = [e for e in reversed(self.entries.of_kind(RAN, 400)) if e.actor and e.actor.id == agent.session and e.data["at"] > after]
        return Response.json({"lines": [self.terminal_line(n, e) for e in ran][-200:]})

    @staticmethod
    def terminal_line(n: int, entry: Entry) -> TerminalLine:
        part = entry.data["part"]
        tool = "Journal" if part.split(" ")[0].endswith("journal") else "Bash"
        return TerminalLine(agent=n, at=entry.data["at"], tool=tool, command=part, output=entry.data["output"], seconds=entry.data["seconds"], status=entry.data["status"], stepped=False, level="everything")

    def post_agent_shell(self, request: Request) -> Response:
        """A command typed in the terminal pane goes to the agent's own terminal, as the user would type it."""
        command = request.body.get("command", "").strip()
        if command:
            self.supervisor.type_raw(self.scope.id, command)
        return Response.json({"queued": bool(command)})

    # events

    def get_events(self, request: Request) -> Response:
        environment = self.here()
        return Response.json(self.events_since(environment, int(request.queried("since")), int(request.queried("last"))))

    def events_since(self, environment: Environment, since: int, last: int = 0) -> list[dict]:
        """The events after an id; a viewer asking from an id ahead of the record remembers a journal that was reset, and is given the recent page so it falls back in step."""
        if since > self.entries.last_id():
            since = 0
        entries = self.entries.shown_since(since) if since else list(reversed(self.entries.shown_recent(last or 100)))
        agent_n = {a.session: a.id for a in self.agents.in_()}
        found = [self.events.of(e, environment.name, agent_n.get(e.actor.id if e.actor else "", 0)) for e in entries]
        return [e for e in found if e]

    def get_stream(self, request: Request) -> StreamResponse:
        environment = self.here()

        def read(entries):
            """The stream is read after the request has left its scope: each read names the environment again."""
            with self.scope.of(environment.id):
                return entries()

        def chunks() -> Iterator[bytes]:
            yield b": open\n\n"
            last = read(self.entries.last_id)
            quiet = 0.0
            while True:
                time.sleep(0.5)
                quiet += 0.5
                fresh = read(lambda: self.entries.shown_since(last))
                for entry in fresh:
                    last = entry.id
                    event = self.events.of(entry, environment.name)
                    if event:
                        quiet = 0.0
                        yield f"id: {event['id']}\ndata: {json.dumps(event)}\n\n".encode()
                if quiet >= BEAT:
                    quiet = 0.0
                    yield b"event: beat\ndata: keep\n\n"
        return StreamResponse("text/event-stream", chunks())

    # helpers

    def here(self) -> Environment:
        return self.environments.find(self.scope.id)

    def first_environment(self) -> Environment:
        return (self.environments.all() or [self.environments.named("main")])[0]

    def row_of(self, type_: str, n: int) -> dict | None:
        if type_ not in self.shapers.types():
            return None
        row = next((r for r in self.shapers.named(type_).rows() if r.n == n), None)
        return row.to_json() if row else None
