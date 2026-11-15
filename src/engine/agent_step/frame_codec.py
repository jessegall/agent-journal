import json
from collections.abc import Sequence
from dataclasses import fields, is_dataclass
from datetime import datetime
from enum import Enum
from types import NoneType, UnionType
from typing import Any, Union, get_args, get_origin, get_type_hints

from engine.agent_stack.need_key import NeedKey
from engine.agent_stack.frame import Frame
from engine.agent_stack.states.blocked import Blocked
from engine.agent_stack.states.compacting import Compacting
from engine.agent_stack.states.ended import Ended
from engine.agent_stack.states.paused import Paused
from engine.agent_stack.states.state import State
from engine.agent_stack.states.stopped import Stopped
from engine.agent_stack.states.waiting import Waiting
from engine.agent_stack.states.working import Working
from engine.agent_step.stored_frame import StoredFrame

STATE_CLASSES: dict[str, type[State]] = {state.__name__: state for state in (Stopped, Working, Waiting, Blocked, Compacting, Paused, Ended)}
STATE_FIELD = "state_name"


class FrameCodec:
    """Turns an agent's frames into the JSON its stack row keeps and back, each state by its class name and every
    field by its declared type; a frame whose state the code no longer knows raises, so the step reseeds it."""

    @staticmethod
    def encoded(frames: Sequence[Frame]) -> str:
        return json.dumps([{STATE_FIELD: type(frame.state).__name__, **FrameCodec.plain(frame)} for frame in frames])

    @staticmethod
    def decoded(text: str) -> list[Frame]:
        return [FrameCodec.frame(StoredFrame(**entry)) for entry in json.loads(text)]

    # a need key alone, as a person's suppression of a frame keeps it
    @staticmethod
    def encoded_key(key: NeedKey) -> str:
        return json.dumps(FrameCodec.plain(key))

    @staticmethod
    def decoded_key(text: str) -> NeedKey:
        return FrameCodec.built(NeedKey, json.loads(text))

    @staticmethod
    def frame(stored: StoredFrame) -> Frame:
        state = FrameCodec.built(STATE_CLASSES[stored.state_name], stored.state)
        return Frame(state, FrameCodec.typed(get_type_hints(Frame)["need_key"], stored.need_key), datetime.fromisoformat(stored.entered_at))

    @staticmethod
    def plain(value: object) -> Any:
        if is_dataclass(value) and not isinstance(value, type):
            return {field.name: FrameCodec.plain(getattr(value, field.name)) for field in fields(value)}
        if isinstance(value, Enum):
            return value.value
        if isinstance(value, datetime):
            return value.isoformat()
        if isinstance(value, (tuple, list)):
            return [FrameCodec.plain(item) for item in value]
        return value

    @staticmethod
    def built(cls: type, values: dict[str, Any]) -> Any:
        hints = get_type_hints(cls)
        return cls(**{name: FrameCodec.typed(hints[name], value) for name, value in values.items()})

    @staticmethod
    def typed(hint: Any, value: Any) -> Any:
        if get_origin(hint) in (Union, UnionType):
            return None if value is None else FrameCodec.typed(next(arg for arg in get_args(hint) if arg is not NoneType), value)
        if get_origin(hint) is tuple:
            item_hint = get_args(hint)[0]
            return tuple(FrameCodec.typed(item_hint, item) for item in value)
        if isinstance(hint, type) and issubclass(hint, Enum):
            return hint(value)
        if hint is datetime:
            return datetime.fromisoformat(value)
        if isinstance(hint, type) and is_dataclass(hint):
            return FrameCodec.built(hint, value)
        return value
