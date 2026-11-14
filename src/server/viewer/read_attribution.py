from dataclasses import dataclass

from engine.types.type_guards import is_mapping
from server.errors.viewer_request_error import ViewerRequestError


@dataclass(frozen=True)
class ReadAttribution:
    client_id: str = ""
    command_id: str = ""
    joined_callers: int = 0
    followed_command_id: str = ""
    complete: bool = True

    @classmethod
    def parsed(cls, value: object) -> "ReadAttribution":
        if not is_mapping(value):
            raise ViewerRequestError("read attribution is an object")
        client_id, command_id = value.get("client_id"), value.get("command_id")
        joined_callers, followed_command_id = value.get("joined_callers", 0), value.get("followed_command_id", "")
        if not isinstance(client_id, str) or not client_id or len(client_id) > 128:
            raise ViewerRequestError("read attribution names its browser client")
        if not isinstance(command_id, str) or not command_id or len(command_id) > 128:
            raise ViewerRequestError("read attribution names its logical command")
        if type(joined_callers) is not int or joined_callers < 0:
            raise ViewerRequestError("joined callers is a nonnegative integer")
        if not isinstance(followed_command_id, str) or len(followed_command_id) > 128:
            raise ViewerRequestError("a trailing read names the command it follows")
        return cls(client_id, command_id, joined_callers, followed_command_id, value.get("complete", False) is True)
