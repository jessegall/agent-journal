import time
from pathlib import Path

from engine import runtime
from engine.keeper import ServiceSpec
from engine.package import entry
from engine.record import Record
from engine.services import BUILD, allocate, current_build, files_for
from features.sharing.controller import Shares
from features.sharing.tunnel import subdomain, tunler
from resources.base import SYSTEM

SERVER, TUNNEL = "sharing.server", "sharing.tunnel"


def open_shares(root: Path) -> list:
    now = time.time()
    shares = Shares(Record(root, runtime.env(root)), actor=SYSTEM)
    return [row for row in shares.summaries() if row.get("token") and row.get("approved") and not row["completed"] and not row["deleted"]
            and not (row.get("expires") and row["expires"] < now)]


def share_services(root: Path, taken: set) -> list:
    if not open_shares(root):
        return []
    port, blocked = allocate(root, SERVER, None, taken)
    taken.add(port)
    specs = [ServiceSpec(id=SERVER, plugin="sharing", service="server", run=[*entry("features.sharing.server"), str(root), str(port)],
                         cwd=str(Path(root).parent), port=port, blocked=blocked, url=f"http://127.0.0.1:{port}", env={BUILD: current_build(root)},
                         **files_for(root, SERVER))]
    command = tunler()
    if command:
        specs.append(ServiceSpec(id=TUNNEL, plugin="sharing", service="tunnel", cwd=str(Path(root).parent),
                                 run=[command, str(port), f"--domain={subdomain(root)}", "--inspect=0"], env={BUILD: f"{current_build(root)}:{port}"},
                                 **files_for(root, TUNNEL)))
    return specs
