from __future__ import annotations

import time
from pathlib import Path

import agents
import settings as settings_mod
import state
import tracks
import transcript
from controller import Controller, Payload, Result

#: a subagent that has made no tool call for this long is no longer counted as working
SUBAGENT_MINUTES = 30
#: AN UNFINISHED SUBAGENT IS NOT DROPPED FOR BEING QUIET. Nothing can tell us a subagent died, so a
#: dispatch that goes quiet for an hour and one that crashed look identical — and dropping both is how
#: a subagent "vanishes" exactly when the user goes looking for it. It stays, marked quiet, until its
#: SubagentStop arrives or a day has passed.
QUIET_HOURS = 24


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
        # A FINISHED SUBAGENT STAYS FOR A WHILE. It used to leave the moment it stopped, which is the
        # moment the user turns to look at what it just did; `crew_finished_minutes` is how long its
        # line is still there to click.
        keep = settings_mod.load(root)[0]["crew_finished_minutes"] * 60
        for agent in agents.live(root, env, QUIET_HOURS * 60):
            parent = agents.parent_of(root, env, agent)
            working = agents.working(root, env, agent)
            done = agents.finished(root, env, agent)
            since_done = time.time() - agents.done_at(root, env, agent) if done else 0.0
            if done and since_done > keep:
                continue
            # quiet is not gone: it has not called a tool in a while and has not said it finished
            quiet = not working and not done
            out.append({"kind": "subagent", "id": agent[:8], "name": agents.described(root.parent, parent, agent),
                        "working": working, "state": "active" if working else "finished" if done else "quiet",
                        "quiet": quiet,
                        "age_text": agents.age(root, env, agent), "parent": parent[:8],
                        "quiet_secs": int(time.time() - float((agents.seen(root).get(env) or {}).get(agent, 0) or 0)) if quiet else None,
                        "ended_age": agents.done_age(root, env, agent) if done else "",
                        "ended_secs": int(since_done) if done else None,
                        "model": transcript.last_model(transcript.find(root.parent, f"agent-{agent}"))})
        return Result("ok", "", out)
