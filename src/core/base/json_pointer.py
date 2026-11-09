import copy

from core.base.refusal import Refusal
from core.base.type_guards import is_list, is_mapping


class JsonPointer:
    """A place in a JSON document written as a pointer, /paths/0/name: setting a value there, and listing the places
    where two documents differ."""

    @staticmethod
    def parts(pointer: str) -> list[str]:
        if not pointer.startswith("/"):
            raise Refusal(f"{pointer} is not a JSON pointer", "start it with /, as /paths/0")
        return [part.replace("~1", "/").replace("~0", "~") for part in pointer[1:].split("/")]

    @staticmethod
    def with_value(document: object, pointer: str, value: object) -> object:
        changed = copy.deepcopy(document)
        parts = JsonPointer.parts(pointer)
        place = changed
        for part in parts[:-1]:
            place = JsonPointer.child(place, part, pointer)
        last = parts[-1]
        if is_mapping(place):
            place[last] = value
        elif is_list(place) and last == "-":
            place.append(value)
        elif is_list(place) and last.isdigit() and int(last) < len(place):
            place[int(last)] = value
        else:
            raise Refusal(f"{pointer} is no place in the document", "name an object key or a list position that is there")
        return changed

    @staticmethod
    def child(place: object, part: str, pointer: str) -> object:
        if is_mapping(place) and part in place:
            return place[part]
        if is_list(place) and part.isdigit() and int(part) < len(place):
            return place[int(part)]
        raise Refusal(f"{pointer} is no place in the document", "name an object key or a list position that is there")

    @staticmethod
    def differences(old: object, new: object, pointer: str = "") -> list[str]:
        if is_mapping(old) and is_mapping(new):
            names = list(dict.fromkeys([*old, *new]))
            return [difference for name in names for difference in JsonPointer.differences(old.get(name), new.get(name), f"{pointer}/{JsonPointer.escaped(str(name))}")
                    if name not in old or name not in new or old[name] != new[name]]
        if is_list(old) and is_list(new) and len(old) == len(new):
            return [difference for number, (old_item, new_item) in enumerate(zip(old, new)) if old_item != new_item for difference in JsonPointer.differences(old_item, new_item, f"{pointer}/{number}")]
        return [] if old == new else [pointer or "/"]

    @staticmethod
    def escaped(name: str) -> str:
        return name.replace("~", "~0").replace("/", "~1")
