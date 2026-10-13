"""How the journal's own hook is told apart from the other hooks in an agent's settings."""

LEGACY = ".journal/hook.py"


def journal_hook(text: str) -> bool:
    return LEGACY in text or ("/hook.sh" in text and "/.journal" in text)
