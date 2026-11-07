from typing import NotRequired, TypedDict

CodexCommandIdentity = TypedDict("CodexCommandIdentity", {
    "type": str,
    "command": str,
    "timeout": int,
    "async": bool,
    "statusMessage": NotRequired[str],
    "additionalContextLimit": NotRequired[int],
})
