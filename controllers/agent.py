from __future__ import annotations

from pathlib import Path

import agents
import settings as settings_mod
import state
import tracks
import transcript
import work
from pins import age
from controller import Controller, Result
from controllers.activity import context_use
from payloads import agent as agent_payloads
from templates import render as fill

MESSAGES = {
    "no_agent": "no {kind} {agent} has worked on {env}",
    "no_transcript": "the transcript of {kind} {agent} is not on this machine",
}

#: a subagent that has made no tool call for this long counts as finished
SUBAGENT_MINUTES = 30


def say(message: str, /, **values) -> str:
    return fill(MESSAGES[message], **values)


class AgentController(Controller):
    """One agent on an environment, a session or a subagent: what it is doing, and its transcript."""
    resource = "agent"
    noun = "agent"
    actions = ("index",)
    numbered = ()
    payloads = {"index": agent_payloads.AgentPayload}

    @staticmethod
    def _session(root: Path, env: str, wanted: str) -> str | None:
        """The session asked for, else the live one on the environment, else the latest that worked there."""
        known = [stem for stem, track in tracks._bindings(root).items() if track == env]
        known += [stem for stem, _ in state.runtime_files(root)
                  if stem not in known and state.get(root, "ended_on", "", stem=stem) == env]
        if wanted:
            return next((s for s in known if s.startswith(wanted)), None)
        live = [stem for stem, info in tracks.live(root).items() if info["track"] == env]

        def seen(stem: str) -> float:
            f = state.runtime_file(root, stem)
            return f.stat().st_mtime if f.is_file() else 0.0
        pool = live or known
        return max(pool, key=seen) if pool else None

    @staticmethod
    def _subagent(root: Path, env: str, wanted: str) -> str | None:
        return next((a for a in (agents.seen(root).get(env) or {}) if a.startswith(wanted)), None) if wanted else None

    def index(self, root: Path, p: agent_payloads.AgentPayload) -> Result:
        kind = "subagent" if p.kind == "subagent" else "session"
        wanted = (p.agent or "").strip()
        full = self._subagent(root, p.env, wanted) if kind == "subagent" else self._session(root, p.env, wanted)
        if not full:
            return Result("missing", say("no_agent", kind=kind, agent=wanted, env=p.env))
        path = transcript.find(root.parent, f"agent-{full}" if kind == "subagent" else full)
        if p.transcript:
            if path is None:
                return Result("missing", say("no_transcript", kind=kind, agent=full[:8]))
            lines, _ = transcript.read(path)
            return Result("ok", "", transcript.page(lines, before=p.before or None, limit=max(50, min(int(p.limit or 1000), 2000))))
        return Result("ok", "", self._about(root, p.env, kind, full, path))

    @staticmethod
    def _about(root: Path, env: str, kind: str, full: str, path: Path | None) -> dict:
        window = settings_mod.load(root)[0].get("context_window") or state.get(root, "window", 0) or 0
        out = {"kind": kind, "id": full[:8], "env": env, "model": transcript.last_model(path), "has_transcript": path is not None}
        if kind == "subagent":
            parent = agents.parent_of(root, env, full)
            working = agents.active(root, env, full, SUBAGENT_MINUTES)
            out.update(name=agents.described(root.parent, parent, full) or f"Subagent {full[:8]}",
                       status="working" if working else "finished", seen=agents.age(root, env, full),
                       parent=parent[:8], context=None, work=[], dispatched=[])
            return out
        live = tracks.live(root).get(full)
        working = bool(live) and state.get(root, "last_event", "", stem=full) not in ("Stop", "")
        out.update(name=f"Session {full[:8]}", status="working" if working else "idle" if live else "ended",
                   seen=tracks.age_text(live["age"]) if live else "", parent="", context=context_use(path, window))
        out["work"] = [{"n": n, "subject": w.get("subject", ""), "ended": bool(w.get("ended")), "files": len(w.get("files") or []),
                        "commits": len(w.get("commits") or []), "when": age(w.get("ended") or w.get("at") or "")}
                       # work records the transcript file that opened it, not the bare session id
                       for n, w in enumerate(work._all(root, env), 1)
                       if Path(str(w.get("session") or "")).stem == full and not w.get("removed")][::-1]
        parents = (state.get(root, agents.PARENT, {}) or {}).get(env) or {}
        out["dispatched"] = [{"id": a[:8], "name": agents.described(root.parent, full, a) or f"Subagent {a[:8]}",
                              "working": agents.active(root, env, a, SUBAGENT_MINUTES), "age": agents.age(root, env, a)}
                             for a, parent in parents.items() if parent == full]
        return out
