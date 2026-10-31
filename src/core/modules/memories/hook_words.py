import re

from core.base.driver.hook_event import HookEvent

WORD = re.compile(r"[a-z0-9][a-z0-9-]{1,39}")


def hook_words(event: HookEvent) -> tuple[str, ...]:
    tool = event.tool
    texts = [event.prompt or "", *(tool.files if tool is not None else ()), tool.shell.line if tool is not None and tool.shell is not None else ""]
    return tuple(dict.fromkeys(WORD.findall(" ".join(texts).lower())))
