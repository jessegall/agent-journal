import time

from features import trigger
from features.base import Feature, on


class Housekeeping(Feature):
    name = "housekeeping"
    title_ = "Housekeeping"
    abstract_ = "The runtime folder is kept small: terminal captures and logs are cut to their tail, and files of sessions gone quiet are removed"
    help_ = "Once an hour: each printed-<session> capture keeps its last 64 KB, each log its last 1 MB; trigger, gate, seat, session and capture files untouched for housekeeping.days (7) are removed."
    trigger = {"every": 60, "unit": trigger.MINUTES}
    DAYS = "days"
    days = 7
    tails = {"printed-*": 64 * 1024, "*.log": 1024 * 1024}
    sessions = ("printed-*", "trigger-*.json", "gate-*.json", "seat-*.json", "session-*.json")

    @on("agent.updated")
    def sweep(self, event, record) -> None:
        if self.agent_due(event, record):
            self.tidy(record)

    def tidy(self, record) -> dict:
        runtime = record.root / "runtime"
        if not runtime.is_dir():
            return {"removed": 0, "trimmed": 0}
        quiet = time.time() - record.setting(self.name, {}).get(self.DAYS, self.days) * 86400
        removed = [f for pattern in self.sessions for f in runtime.glob(pattern) if f.is_file() and f.stat().st_mtime < quiet]
        for f in removed:
            f.unlink(missing_ok=True)
        trimmed = [f for pattern, keep in self.tails.items() for f in runtime.glob(pattern) if f.is_file() and self.trim(f, keep)]
        return {"removed": len(removed), "trimmed": len(trimmed)}

    def trim(self, f, keep: int) -> bool:
        if f.stat().st_size <= keep:
            return False
        with f.open("r+b") as held:
            held.seek(-keep, 2)
            tail = held.read()
            held.seek(0)
            held.write(tail)
            held.truncate()
        return True
