from providers import PROVIDERS


def last_said(record, agent) -> str:
    provider = PROVIDERS.get(agent.provider)
    if not provider or not agent.transcript:
        return ""
    turns = provider().transcript(agent.transcript)
    said = [t for t in turns if t.who == "agent" and t.text.strip()]
    return said[-1].text if said else ""
