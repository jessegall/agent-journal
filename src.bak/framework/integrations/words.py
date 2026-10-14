import re

HIDDEN = re.compile("[​-‏‪-‮⁠-⁤⁦-⁩﻿]")
TITLE, BODY, COMMENT = 200, 20000, 5000
CUT = "…"


def cleaned(text: str, limit: int) -> str:
    """Words from an outside source with the characters that hide or reorder text taken out, cut to the length a person would read."""
    plain = HIDDEN.sub("", text)
    return plain if len(plain) <= limit else plain[: limit - len(CUT)] + CUT
