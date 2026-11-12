class Reader:
    id: int
    is_default: bool


class Part:
    position: int


def newest_default(readers: list[Reader]) -> list[Reader]:
    # @sin architecture_processes_reader_chosen_outside_reader_layers
    return sorted(readers, key=lambda reader: (not reader.is_default, -reader.id))


def newest(readers: list[Reader]) -> Reader:
    # @sin architecture_processes_reader_chosen_outside_reader_layers
    return max(readers, key=lambda reader: reader.id)


def in_order(parts: list[Part]) -> list[Part]:
    # @righteous architecture_processes_reader_chosen_outside_reader_layers
    return sorted(parts, key=lambda part: part.position)
