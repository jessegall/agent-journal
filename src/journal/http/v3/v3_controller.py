from dataclasses import replace
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
from journal.http.v3.current_work import CurrentWork
from journal.features.registry import Registry
from journal.providers.providers import Providers
from journal.features.skills.skill_files import SkillFiles
from journal.http.v3.listing import Listing
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
from journal.repositories.entries import Entries
from journal.repositories.messages import Messages
from journal.supervisor_link import SupervisorLink
from journal.repositories.environments import Environments
from journal.repositories.tasks import Tasks

COLOR = "#5e64c9"
BEAT = 15.0
STARTED = time.time()


SILENT_AFTER = 900.0
"""Seconds a busy agent may send nothing before the viewer says it is not responding."""


TIMELINES = ("message", "comment")
"""The lists that are a chat or a feed: they page by number alone, so opening the journal loads the last page and the rest comes on scrolling up."""


class V3Controller:
    """Version 3's API, answered from version 4's rows, so the viewer sees nothing changed."""

    def __init__(self, config: Config, shapers: Shapers, manifest: V3Manifest, settings: V3Settings, actions: V3Actions, environments: Environments, entries: Entries, agents: Agents, tasks: Tasks, machine: Machine, chosen: ChosenVoice, messages: Messages, files: ProjectFiles, current: CurrentWork, supervisor: SupervisorLink, registry: Registry, skill_files: SkillFiles, providers: Providers, events: V3Events) -> None:
        self.config, self.shapers, self.manifest, self.settings, self.actions = config, shapers, manifest, settings, actions
        self.messages, self.files, self.current, self.supervisor, self.registry, self.skill_files, self.providers = messages, files, current, supervisor, registry, skill_files, providers
        self.events = events
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
            agent = {"status": d["status"], "provider": live.provider or "claude", "model": d["model"], "context": live.context_mark, "uses": 0, "started": d["started"], "at": d["at"], "tool": d["tool"], "file": "", "asking": bool(d["asking"]), "background_run": "", "says": d["last_message"], "doing": d["doing"]}
            held = self.current.of(live)
            work = {"n": held.task.id, "title": held.task.title, "todo": held.task.id, "parked": False, "awaiting": held.awaiting} if held else None
        counts = {"questions": self.open_count("question", environment), "messages": len(self.messages.unread(environment.id)), "suggestions": 0, "todos": self.open_count("todo", environment), "prompts": 0, "routed": 0}
        silent = agent["status"] in ("busy", "working") and time.time() - agent["at"] > SILENT_AFTER
        return {"name": environment.name, "agent": agent, "work": work, "kind": "main", "helpers": [], "tickets": [], "plans": [], "last": None, "counts": counts, "silent": silent}

    def open_count(self, type_: str, environment: Environment) -> int:
        return len([r for r in self.shapers.named(type_).rows(environment) if r.is_open])

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
        """The status bar's queue: each tool call and each shell part the live agent ran, as it opened and as it closed."""
        environment = self.environment_of(request)
        live = self.agents.live(environment.id)
        if not live:
            return Response.json({"queue": []})
        recent = [e for e in reversed(self.entries.of_kind_in(environment.id, 60)) if e.actor and e.actor.id == live.session and BarRow.shows(e)]
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
        return Response.json(self.settings.tree(self.environment_of(request).id))

    def post_settings(self, request: Request) -> Response:
        """The viewer keeps the answer as its whole settings tree, so a toggle answers with all of it."""
        self.settings.save(request.body, request.actor)
        return Response.json(self.settings.tree(self.environment_of(request).id))

    # rows

    def get_list(self, request: Request) -> Response:
        shaper = self.shapers.named(request.params["type"])
        if shaper is None:
            return Response.not_found(request.params["type"])
        listing = Listing.from_query(request.query)
        if request.params["type"] in TIMELINES:
            listing = replace(listing, timeline=True)
        return Response.json(listing.listed(shaper.rows(self.environment_of(request))))

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
        type_, action = request.params["type"], request.params["action"]
        if not request.params["n"].isdigit():
            return Response.refused(f"{action} on a {type_} by its session is not something the viewer can do here yet")
        n = int(request.params["n"])
        try:
            done = self.actions.act(type_, n, action, request.body, request)
        except NotFound as missing:
            return Response.not_found(str(missing))
        if done is None:
            return Response.refused(f"{action} is not something the viewer can do to a {type_} here")
        return Response.json(done if isinstance(done, V3Row) else self.row_of(type_, n, environment) or {})

    def post_upload(self, request: Request) -> Response:
        environment = self.environment_of(request)
        type_, n = request.params["type"], int(request.params["n"])
        try:
            done = self.actions.upload(type_, n, request)
        except NotFound as missing:
            return Response.not_found(str(missing))
        if done is None:
            return Response.refused(f"a {type_} takes no files here")
        return Response.json(self.row_of(type_, n, environment) or {})

    def get_attached_file(self, request: Request):
        found = self.actions.attachments.read(request.params["type"], int(request.params["n"]), request.params["name"])
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
        provider = self.providers.named(next((a.provider for a in self.agents.all() if a.session == request.params["session"]), "claude") or "claude")
        action, value = request.body.get("action", ""), request.body.get("value", "")
        choice = next((c for g in provider.controls["groups"] if g["key"] == action for c in g["choices"] if c["value"] == value), None)
        if choice is None:
            return Response.refused(f"{action} {value} is not a choice the agent bar offers")
        self.supervisor.type_raw(self.environment_of(request).id, choice["command"])
        return Response.json({"queued": True})

    def get_skills(self, request: Request) -> Response:
        """The journal's skills, with whether the agent asked for has read each, as the skills page lists them."""
        agent = next((a for a in self.agents.all() if str(a.id) == request.query.get("agent", "")), None)
        loaded = set((agent.skills_loaded or {}).keys()) if agent else set()
        return Response.json([{"name": skill.name, "description": skill.description, "loaded": skill.name in loaded, "always": False, "stale": False, "depth": 0} for skill in self.registry.skills()])

    def get_skill(self, request: Request) -> Response:
        skill = self.registry.skill_named(request.params["name"])
        return Response.json({"name": skill.name, "description": skill.description, "text": skill.body}) if skill else Response.not_found("no such skill")

    def post_skill_load(self, request: Request) -> Response:
        skill = self.registry.skill_named(request.params["name"])
        if skill is None:
            return Response.not_found("no such skill")
        self.supervisor.type(self.environment_of(request).id, f"read the {skill.name} skill now: {self.skill_files.path(skill)}")
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
        environment = self.environment_of(request)
        n = int(request.params["n"])
        agent = next((a for a in self.agents.in_(environment.id) if a.id == n), None)
        if agent is None:
            return Response.json({"cursor": time.time(), "edits": [], "older": False})
        since = float(request.query.get("since", 0) or 0)
        edits = []
        for e in reversed(self.entries.of_kind_in(environment.id, 400)):
            tool = e.data.get("tool_name", "")
            if not (e.actor and e.actor.id == agent.session) or seconds(e.created_at) <= since:
                continue
            if e.kind == RAN:
                edits += self.edits_of_part(e)
            elif e.kind == "ToolFinished" and tool in ("Edit", "Write", "MultiEdit") and (edit := self.edit_of(e, tool)):
                edits.append(edit)
        return Response.json({"cursor": time.time(), "edits": edits[-50:], "older": False})

    @staticmethod
    def edits_of_part(entry) -> list[dict]:
        """The files a shell part changed, as the tree moved while it ran: counted, not shown line by line."""
        at = entry.data["at"]
        return [{"id": f"{c['path']}@{at}", "path": c["path"], "kind": "edit", "at": at, "added": c["added"], "removed": c["removed"], "first_line": 1, "last_line": 1, "rows": [], "image": False, "command": entry.data["part"][:80]}
                for c in entry.data.get("changed", [])]

    def edit_of(self, entry, tool: str) -> dict | None:
        input_ = entry.data.get("tool_input", {})
        path = input_.get("file_path", "")
        if not path:
            return None
        try:
            path = str(Path(path).resolve().relative_to(self.config.root.resolve()))
        except ValueError:
            path = Path(path).name
        rows = self.patch_rows(entry.data.get("tool_response", {}), input_, tool)
        at = seconds(entry.created_at)
        numbered = [r["line"] for r in rows if r["line"]]
        return {"id": f"{path}@{at}", "path": path, "kind": "create" if tool == "Write" else "edit", "at": at, "added": len([r for r in rows if r["kind"] == "add"]), "removed": len([r for r in rows if r["kind"] == "del"]),
                "first_line": min(numbered) if numbered else 1, "last_line": max(numbered) if numbered else len(rows), "rows": rows[:200], "image": False}

    @staticmethod
    def patch_rows(response, input_: dict, tool: str) -> list[dict]:
        """The changed lines with their numbers from the provider's structured patch; a whole write is all added lines from one."""
        hunks = response.get("structuredPatch", []) if isinstance(response, dict) else []
        if not hunks:
            added = (input_.get("new_string", "") if tool == "Edit" else input_.get("content", "")).splitlines()
            return [{"kind": "add", "line": n, "text": line, "hidden": 0} for n, line in enumerate(added, 1)]
        rows = []
        for hunk in hunks:
            old, new = hunk.get("oldStart", 1), hunk.get("newStart", 1)
            for text in hunk.get("lines", []):
                mark, body = text[:1], text[1:]
                if mark == "+":
                    rows.append({"kind": "add", "line": new, "text": body, "hidden": 0}); new += 1
                elif mark == "-":
                    rows.append({"kind": "del", "line": old, "text": body, "hidden": 0}); old += 1
                else:
                    rows.append({"kind": "ctx", "line": new, "text": body, "hidden": 0}); new += 1; old += 1
        return rows

    def get_agent_edited_file(self, request: Request) -> Response:
        path = request.query.get("id", "").split("@")[0]
        file = (self.config.root / path).resolve()
        if not str(file).startswith(str(self.config.root.resolve())) or not file.is_file():
            return Response.not_found(path)
        return Response.json({"path": path, "text": file.read_text(errors="replace")[:200000]})

    def get_agent_terminal(self, request: Request) -> Response:
        """The shell commands the agent ran, part by part, with what each printed and how long it took, as the terminal pane shows them."""
        environment = self.environment_of(request)
        n = int(request.params["n"])
        agent = next((a for a in self.agents.in_(environment.id) if a.id == n), None)
        if agent is None:
            return Response.json({"lines": []})
        after = float(request.query.get("after", 0) or 0)
        ran = [e for e in reversed(self.entries.of_kind(environment.id, RAN, 400)) if e.actor and e.actor.id == agent.session and e.data["at"] > after]
        return Response.json({"lines": [self.terminal_line(n, e) for e in ran][-200:]})

    @staticmethod
    def terminal_line(n: int, entry: Entry) -> dict:
        part = entry.data["part"]
        tool = "Journal" if part.split(" ")[0].endswith("journal") else "Bash"
        return {"agent": n, "at": entry.data["at"], "tool": tool, "command": part, "output": entry.data["output"], "seconds": entry.data["seconds"], "status": entry.data["status"], "stepped": False, "level": "everything"}

    def post_agent_shell(self, request: Request) -> Response:
        """A command typed in the terminal pane goes to the agent's own terminal, as the user would type it."""
        command = request.body.get("command", "").strip()
        if command:
            self.supervisor.type_raw(self.environment_of(request).id, command)
        return Response.json({"queued": bool(command)})

    def get_agent_transcript(self, request: Request) -> Response:
        return Response.json({"turns": [], "rows": [], "more": False})

    # events

    def get_events(self, request: Request) -> Response:
        environment = self.environment_of(request)
        since = int(request.query.get("since", 0) or 0)
        return Response.json(self.events_since(environment, since, int(request.query.get("last", 0) or 0)))

    def events_since(self, environment: Environment, since: int, last: int = 0) -> list[dict]:
        """The events after an id; a viewer asking from an id ahead of the record remembers a journal that was reset, and is given the recent page so it falls back in step."""
        if since > self.entries.last_id(environment.id):
            since = 0
        entries = self.entries.since(environment.id, since) if since else list(reversed(self.entries.of_kind_in(environment.id, last or 100)))
        agent_n = {a.session: a.id for a in self.agents.in_(environment.id)}
        found = [self.events.of(e, environment.name, agent_n.get(e.actor.id if e.actor else "", 0)) for e in entries]
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
                    event = self.events.of(entry, environment.name)
                    if event:
                        quiet = 0.0
                        yield f"id: {event['id']}\ndata: {json.dumps(event)}\n\n".encode()
                if quiet >= BEAT:
                    quiet = 0.0
                    yield b"event: beat\ndata: keep\n\n"
        return StreamResponse("text/event-stream", chunks())

    # helpers

    def environment_of(self, request: Request) -> Environment:
        """The environment the request names; a read never makes one, so a stray address is answered not found."""
        return self.environments.existing(request.params.get("env") or request.environment)

    def first_environment(self) -> Environment:
        return (self.environments.all() or [self.environments.named("main")])[0]

    def row_of(self, type_: str, n: int, environment: Environment) -> dict | None:
        shaper = self.shapers.named(type_)
        row = next((r for r in (shaper.rows(environment) if shaper else []) if r.n == n), None)
        return row.to_json() if row else None
