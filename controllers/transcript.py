from __future__ import annotations

from pathlib import Path

import state
import tracks
import transcript
from controller import Controller, Result
from payloads import transcript as transcript_payloads
from templates import render as fill

MESSAGES = {
    "no_session": "no session has worked on {env} yet, so there is no transcript to show",
    "no_transcript": "the transcript of session {session} is not on this machine",
}


def say(message: str, /, **values) -> str:
    return fill(MESSAGES[message], **values)


class TranscriptController(Controller):
    """A session's transcript, read a page at a time from the newest end."""
    resource = "transcript"
    noun = "transcript"
    actions = ("index",)
    numbered = ()
    payloads = {"index": transcript_payloads.ChunkPayload}

    @staticmethod
    def _session(root: Path, env: str, wanted: str) -> str | None:
        """The session to show: the one asked for, else the live one on the environment, else the latest that worked there."""
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

    def index(self, root: Path, p: transcript_payloads.ChunkPayload) -> Result:
        stem = self._session(root, p.env, (p.session or "").strip())
        if not stem:
            return Result("missing", say("no_session", env=p.env))
        path = transcript.find(root.parent, stem)
        if path is None:
            return Result("missing", say("no_transcript", session=stem[:8]))
        lines, _ = transcript.read(path)
        mode = "full" if p.mode == "full" else "compact"
        limit = max(20, min(int(p.limit or 200), 1000))
        got = transcript.chunk(lines, before=p.before or None, limit=limit, mode=mode, at=float(p.moment) if p.moment else None)
        return Result("ok", "", {**got, "session": stem[:8], "mode": mode})
