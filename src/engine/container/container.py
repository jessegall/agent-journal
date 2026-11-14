import sys
from types import FrameType
from inspect import Parameter, signature
from typing import TypeVar, get_type_hints

from functools import cache

from engine.container.single_instance import SingleInstance
from engine.errors.built_twice_error import BuiltTwiceError
from engine.errors.late_resolve_error import LateResolveError
from engine.errors.missing_hint_error import MissingHintError
from engine.errors.unbound_value_error import UnboundValueError
from engine.errors.wrong_instance_error import WrongInstanceError

T = TypeVar("T")


UNBUILT_MODULES = sys.stdlib_module_names | {"builtins"}
BUILD_PLACE_FRAMES = 8


@cache
def needed_values(class_type: type) -> tuple[tuple[str, type], ...]:
    hints = get_type_hints(class_type.__init__) if class_type.__init__ is not object.__init__ else {}
    needed = [parameter.name for parameter in signature(class_type.__init__).parameters.values()
              if parameter.name != "self" and parameter.default is Parameter.empty and parameter.kind not in (Parameter.VAR_POSITIONAL, Parameter.VAR_KEYWORD)]
    for name in needed:
        if name not in hints:
            raise MissingHintError(class_type, name)
    return tuple((name, hints[name]) for name in needed)


def depends_on(class_type: type, checked: dict[type, bool]) -> bool:
    if class_type not in checked:
        checked[class_type] = False
        needed = [] if class_type.__module__.partition(".")[0] in UNBUILT_MODULES else [hint for _, hint in needed_values(class_type)]
        checked[class_type] = any(isinstance(hint, type) and depends_on(hint, checked) for hint in needed)
    return checked[class_type]


class Container:
    """Creates the objects the journal needs and hands each one out, creating it only once; a module may name
    the class that stands in for an interface of the core. A sealed container builds no handler, listener, guard
    or rule it did not build before it was sealed."""

    def __init__(self) -> None:
        self.instances: dict[type, object] = {Container: self}
        self.substitutes: dict[type, type[object]] = {}
        self.build_places: dict[type, str] = {}
        self.is_sealed = False

    def bind(self, class_type: type[T], instance: T) -> None:
        self.instances[class_type] = instance

    # builds the implementation anew for the class, as a replacement
    def rebuild(self, class_type: type[T], implementation: type[T]) -> None:
        self.build_places.pop(implementation, None)
        self.replace(class_type, self.constructed(implementation))

    # every instance built on the old one is forgotten with its build, so the next get builds it on the replacement
    def replace(self, class_type: type[T], instance: T) -> None:
        checked: dict[type, bool] = {class_type: True}
        for built_type, built in list(self.instances.items()):
            if built_type not in (class_type, Container) and depends_on(type(built), checked):
                del self.instances[built_type]
                self.build_places.pop(type(built), None)
        self.instances[class_type] = instance

    def seal(self) -> None:
        self.is_sealed = True

    def substitute(self, class_type: type, implementation: type) -> None:
        if not issubclass(implementation, class_type):
            raise WrongInstanceError(class_type, implementation)
        self.substitutes[class_type] = implementation

    def get(self, class_type: type[T]) -> T:
        instance: object = self.instances.get(class_type)
        if instance is None:
            implementation: type[object] = self.substitutes.get(class_type, class_type)
            instance = self.constructed(implementation)
            self.instances[class_type] = instance
        if isinstance(instance, class_type):
            return instance
        raise WrongInstanceError(class_type, instance)

    def constructed(self, class_type: type[T]) -> T:
        if class_type.__module__.partition(".")[0] in UNBUILT_MODULES:
            raise UnboundValueError(class_type)
        if issubclass(class_type, SingleInstance):
            self.record_build(class_type)
        return class_type(**{name: self.get(hint) for name, hint in needed_values(class_type)})

    # the callers that asked for a build, read from the frames alone: formatting a stack reads source lines from
    # disk, which every build of every request would pay for
    @staticmethod
    def build_place(frame: FrameType | None) -> str:
        places: list[str] = []
        while frame is not None and len(places) < BUILD_PLACE_FRAMES:
            places.append(f"{frame.f_code.co_filename}:{frame.f_lineno} in {frame.f_code.co_name}")
            frame = frame.f_back
        return "\n".join(places)

    def record_build(self, class_type: type) -> None:
        place = self.build_place(sys._getframe(2))
        if self.is_sealed:
            raise LateResolveError(class_type, place)
        if class_type in self.build_places:
            raise BuiltTwiceError(class_type, self.build_places[class_type], place)
        self.build_places[class_type] = place
