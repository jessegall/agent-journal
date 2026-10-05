from pathlib import Path

from engine import runtime
from engine.keeper import ServiceSpec
from engine.package import entry
from engine.record import Record
from engine.services import BUILD, allocate, current_build, files_for
from features.sharing.controller import Shares
from features.sharing.resource import ended
from features.sharing.tunnel import subdomain, tunler
from resources.base import Refused, SYSTEM
from engine.extension import Extension

SERVER, TUNNEL = "sharing.server", "sharing.tunnel"
KEEP_UP = Extension()


def open_shares(root: Path) -> list:
    shares = Shares(Record(root, runtime.env(root)), actor=SYSTEM)
    return [row for row in shares.rows.summaries() if row.get("token") and row.get("approved") and not row["deleted"]
            and not ended(row["completed"], row.get("expires"))]


def wanted(root: Path) -> bool:
    from features import running
    from features.sharing.feature import SharingFeature
    record = Record(root, runtime.env(root))
    feature = running(SharingFeature)
    sharing = bool(feature) and feature.enabled(record)
    return (sharing and bool(open_shares(root))) or any(keep(root) for keep in KEEP_UP.each(record))


def share_services(root: Path, taken: set) -> list:
    if not wanted(root):
        return []
    port, blocked = allocate(root, SERVER, None, taken)
    taken.add(port)
    specs = [ServiceSpec(id=SERVER, plugin="sharing", service="server", run=[*entry("features.sharing.server"), str(root), str(port)],
                         cwd=str(Path(root).parent), port=port, blocked=blocked, url=f"http://127.0.0.1:{port}", env={BUILD: current_build(root)},
                         **files_for(root, SERVER))]
    command = tunler()
    if not command:
        return specs
    try:
        domain = subdomain(root)
    except Refused:
        return specs
    inspector, _ = allocate(root, TUNNEL, None, taken)
    taken.add(inspector)
    specs.append(ServiceSpec(id=TUNNEL, plugin="sharing", service="tunnel", cwd=str(Path(root).parent), port=inspector, url=f"http://127.0.0.1:{inspector}",
                             run=[command, str(port), f"--domain={domain}", f"--inspect={inspector}"],
                             env={BUILD: f"{current_build(root)}:{port}:{inspector}"}, **files_for(root, TUNNEL)))
    return specs
