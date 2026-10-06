from pathlib import Path

from engine import runtime
from engine.keeper import ServiceSpec
from engine.package import entry
from engine.record import Record
from engine.services import BUILD, allocate, current_build, files_for, log_file
from features.sharing.controller import ADDRESS_TAKEN, Shares
from features.sharing.resource import ended
from features.sharing.tunnel import SERVER, TUNNEL, refused_address, tunler, tunler_build
from resources.base import Refused, SYSTEM
from engine.extension import Extension

KEEP_UP = Extension()
IDLE = "Nothing is shared and no phone is paired, so the tunnel stays off."
SWITCHED_OFF = "Sharing is switched off, so the tunnel stays off."


def open_shares(root: Path) -> list:
    shares = Shares(Record(root, runtime.env(root)), actor=SYSTEM)
    return [row for row in shares.rows.summaries() if row.get("token") and row.get("approved") and not row["deleted"]
            and not ended(row["completed"], row.get("expires"))]


def links_open(root: Path) -> bool:
    return bool(open_shares(root))


def why_idle(root: Path) -> str:
    from features import running
    from features.sharing.feature import SharingFeature
    record = Record(root, runtime.env(root))
    feature = running(SharingFeature)
    sharing = bool(feature) and feature.enabled(record)
    if any(keep(root) for keep in KEEP_UP.each(record)):
        return ""
    if sharing and open_shares(root):
        return ""
    return IDLE if sharing else SWITCHED_OFF


def wanted(root: Path) -> bool:
    return not why_idle(root)


def share_services(root: Path, taken: set) -> list:
    idle = why_idle(root)
    port, blocked = allocate(root, SERVER, None, taken)
    taken.add(port)
    specs = [ServiceSpec(id=SERVER, plugin="sharing", service="server", run=[*entry("features.sharing.server"), str(root), str(port)],
                         cwd=str(Path(root).parent), port=port, blocked=blocked, idle=idle, url=f"http://127.0.0.1:{port}", env={BUILD: current_build(root)},
                         **files_for(root, SERVER))]
    command = tunler()
    if not command:
        return specs
    try:
        domain = Shares(Record(root, runtime.env(root)), actor=SYSTEM)._subdomain()
    except Refused:
        return specs
    inspector, _ = allocate(root, TUNNEL, None, taken)
    taken.add(inspector)
    specs.append(ServiceSpec(id=TUNNEL, plugin="sharing", service="tunnel", cwd=str(Path(root).parent), port=inspector, url=f"http://127.0.0.1:{inspector}",
                             blocked=ADDRESS_TAKEN if refused_address(log_file(root, TUNNEL)) else "", idle=idle,
                             run=[command, str(port), f"--domain={domain}", f"--inspect={inspector}"],
                             env={BUILD: f"{tunler_build(command)}:{port}:{inspector}"}, **files_for(root, TUNNEL)))
    return specs
