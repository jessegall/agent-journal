from __future__ import annotations

from pathlib import Path

import agents
import state
import tracks
import transcript
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
            working = state.get(root, "last_event", "", stem=stem) not in ("Stop", "")
            # an idle session drops off the list after a while; it is still running, only not worth showing
            if not working and got["age"] > SUBAGENT_MINUTES * 60:
                continue
            out.append({"kind": "session", "id": stem[:8], "name": "", "working": working,
                        "state": "active" if working else "idle", "age": int(got["age"])})
        for agent in agents.live(root, env, SUBAGENT_MINUTES):
            parent = agents.parent_of(root, env, agent)
            working = agents.working(root, env, agent)
            out.append({"kind": "subagent", "id": agent[:8], "name": agents.described(root.parent, parent, agent),
                        "working": working, "state": "active" if working else "finished" if agents.finished(root, env, agent) else "idle",
                        "age_text": agents.age(root, env, agent), "parent": parent[:8],
                        "model": transcript.last_model(transcript.find(root.parent, f"agent-{agent}"))})
        return Result("ok", "", out)
