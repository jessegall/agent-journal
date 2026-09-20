import re

HEREDOC = re.compile(r"<<-?\s*['\"]?(\w+)")


def without_scripts(command: str) -> str:
    kept, end, patch = [], "", False
    for line in str(command or "").split("\n"):
        if line.strip() == "*** Begin Patch":
            patch = True
            continue
        if patch:
            if line.strip() == "*** End Patch":
                patch = False
            continue
        if end:
            if line.strip() == end:
                end = ""
            continue
        kept.append(line)
        found = HEREDOC.search(line)
        if found:
            end = found.group(1)
    return "\n".join(kept)
