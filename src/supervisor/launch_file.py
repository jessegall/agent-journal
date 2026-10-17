import json
import os
from pathlib import Path

from supervisor.bad_launch_file import BadLaunchFile
from supervisor.band import Band
from supervisor.inbox import Inbox
from supervisor.mirror import Mirror
from supervisor.service import Service
from supervisor.services import Services
from supervisor.supervisor import Supervisor
from supervisor.terminal import Terminal

PROCESS = ("command", "folder", "env")
"""What every process in the file names."""


class LaunchFile:
    """What a supervisor starts from, as the journal wrote it: the agent in front, the services beside it, where its socket, announce file and mirror go, and the band's words."""

    def __init__(self, data: dict) -> None:
        self.data = data

    @classmethod
    def read(cls, path: Path) -> "LaunchFile":
        try:
            data = json.loads(path.read_text())
        except (OSError, ValueError) as fault:
            raise BadLaunchFile(f"the launch file {path} cannot be read: {fault}") from fault
        missing = [key for key in ("front", "socket", "announce") if key not in data]
        missing += [f"front's {key}" for key in PROCESS if key not in data.get("front", {})]
        missing += [f"{service.get('name', 'a service')}'s {key}" for service in data.get("services", []) for key in ("name", "log", *PROCESS) if key not in service]
        if missing:
            raise BadLaunchFile(f"the launch file {path} has no {', '.join(missing)}")
        return cls(data)

    def supervisor(self) -> Supervisor:
        front = self.data["front"]
        services = Services(*(Service(s["name"], s["command"], Path(s["folder"]), s["env"], Path(s["log"]), s.get("keep", True)) for s in self.data.get("services", [])))
        band = Band(**self.data["band"]) if self.data.get("band") and os.isatty(1) else None
        mirror = Mirror(Path(self.data["screen"])) if self.data.get("screen") else None
        return Supervisor(Terminal(front["command"], front["folder"], front["env"], tuple(front.get("resume", ()))), Inbox(Path(self.data["socket"]), Path(self.data["announce"])), services, stdin=0 if os.isatty(0) else None, band=band, mirror=mirror)
