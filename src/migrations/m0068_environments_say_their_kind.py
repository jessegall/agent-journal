import re
from pathlib import Path

from controllers.types import Environments, environment_records
from features.helpers.controller import Helpers
from resources.base import SYSTEM
from resources.types import EnvironmentKind

OWNERS = {"helper": EnvironmentKind.HELPER, "todo": EnvironmentKind.SUBAGENT}


def run(root: Path) -> list[str]:
    records = list(environment_records(Path(root)))
    if not records:
        return []
    checkouts = {Path(helper.checkout).name for record in records for helper in Helpers(record, actor=SYSTEM).rows.every() if helper.checkout}
    environments = Environments(records[0], actor=SYSTEM)
    tagged = []
    for place in environments.rows.every():
        if place.kind:
            continue
        kind = kind_of(place.owner, place.title, checkouts)
        environments.update(place.n, kind=kind)
        tagged.append(f"{place.title} is a {kind} environment")
    return tagged


def kind_of(owner: str, title: str, checkouts: set[str]) -> EnvironmentKind:
    if owner:
        return OWNERS.get(owner.split(":")[0], EnvironmentKind.TICKET)
    return EnvironmentKind.HELPER if re.sub(r"-\d+$", "", title) in checkouts else EnvironmentKind.MAIN
