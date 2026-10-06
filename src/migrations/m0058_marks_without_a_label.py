from pathlib import Path

from controllers.types import Agents, environment_records
from resources.base import SYSTEM


def run(root: Path) -> list[str]:
    mended = []
    for record in environment_records(Path(root)):
        agents = Agents(record, actor=SYSTEM)
        for row in [agents.load(found["n"]) for found in agents.rows.summaries() if not found["deleted"]]:
            cards = row.data.get("cards") or []
            kept = [card for card in cards if "label" in card]
            if len(kept) != len(cards):
                agents.update(row.n, cards=kept)
                mended.append(f"{record.env} agent {row.n}: {len(cards) - len(kept)} marks without a label")
    return mended
