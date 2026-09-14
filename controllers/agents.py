from __future__ import annotations

from pathlib import Path

import agents
import state
import tracks
from controller import Controller, Payload, Result

#: a subagent that has made no tool call for this long is no longer counted as working
SUBAGENT_MINUTES = 30


class AgentsController(Controller):
    """Who is working on an environment right now: its sessions, and the subagents they dispatched."""
    resource = "agents"
    noun = "agent"
    actions = ("index",)
    numbered = ()

    def index(self, root: Path, p: Payload) -> Result:
        env = p.env
        out = []
        for stem, got in sorted(tracks.live(root).items(), key=lambda kv: kv[1]["age"]):
            if got["track"] != env:
                continue
            out.append({"kind": "session", "id": stem[:8], "name": "",
                        "working": state.get(root, "last_event", "", stem=stem) not in ("Stop", ""),
                        "age": int(got["age"])})
        for agent in agents.live(root, env, SUBAGENT_MINUTES):
            parent = agents.parent_of(root, env, agent)
            out.append({"kind": "subagent", "id": agent[:8], "name": agents.described(root.parent, parent, agent),
                        "working": True, "age_text": agents.age(root, env, agent), "parent": parent[:8]})
        return Result("ok", "", out)
