from providers import PROVIDERS


def turns(record, agent) -> list:
    provider = PROVIDERS.get(agent.provider)
    if not provider or not agent.transcript:
        return []
    return [t for t in provider().transcript(agent.transcript) if t.who == "agent" and t.text.strip()]


def last_turn(record, agent):
    said = turns(record, agent)
    return said[-1] if said else None


def last_said(record, agent) -> str:
    said = last_turn(record, agent)
    return said.text if said else ""
