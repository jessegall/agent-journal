import sys
from pathlib import Path

HERE = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(HERE / "src"))


def problems() -> list[str]:
    """Every line the journal has actually said names a line its feature declares, read from the nudge rows rather than from the call sites, so a line a plugin sends is judged like any other."""
    import features
    from controllers.types import Nudges, environment_records
    from resources.base import SYSTEM
    features.load()
    found = []
    for record in environment_records(HERE / ".journal"):
        for row in Nudges(record, actor=SYSTEM).rows.every():
            feature, line = row.data.get("feature", ""), row.data.get("line", "")
            if not feature or not line:
                continue
            if feature not in features.FEATURES:
                found.append(f"{record.env}: nudge {row.n} says {feature}.{line} and no feature is called {feature}")
            elif line not in features.FEATURES[feature].lines:
                found.append(f"{record.env}: nudge {row.n} says {feature}.{line}, which {feature} does not declare")
    return sorted(set(found))


if __name__ == "__main__":
    found = problems()
    print("\n".join(found) or "every line the journal has said is one its feature declares")
    sys.exit(1 if found else 0)
