import sys
from pathlib import Path

HERE = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(HERE / "src"))


def problems() -> list[str]:
    """Every expectation of a feature that is about the agent is said in the skill that teaches the feature, read from the skills as they are generated, so what the suite plays and what the agent is told cannot drift apart."""
    import features
    import skills
    from framework.expectations import words_of
    from resources.text import skill_name
    found = []
    written = skills.render()
    for name, feature in features.FEATURES.items():
        if not feature.details.has_skill or feature.details.skill_of:
            continue
        text = written.get(f"{skill_name(name)}/SKILL.md", "")
        found += [f"{name}: the skill does not say {line!r}" for line in words_of(name, agent_only=True) if f"- {line}" not in text]
    return sorted(found)


if __name__ == "__main__":
    found = problems()
    print("\n".join(found) or "every expectation about the agent is in the skill that teaches its feature")
    sys.exit(1 if found else 0)
