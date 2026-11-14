import re

from engine.driver.hook_event import HookEvent

WORD = re.compile(r"[a-z0-9][a-z0-9-]{1,39}")


def text_keywords(text: str) -> tuple[str, ...]:
    return tuple(dict.fromkeys(WORD.findall(text.lower())))


def hook_keywords(event: HookEvent) -> tuple[str, ...]:
    tool = event.tool
    part_texts = tool.shell.part_texts if tool is not None and tool.shell is not None else ()
    texts = [event.prompt or "", *(tool.files if tool is not None else ()), *part_texts]
    return tuple(dict.fromkeys(keyword for text in texts for keyword in text_keywords(text)))
