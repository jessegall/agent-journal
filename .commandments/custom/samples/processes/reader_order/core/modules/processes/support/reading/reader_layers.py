class Reader:
    id: int
    is_default: bool


class Part:
    position: int


def ordered(readers: list[Reader]) -> list[Reader]:
    # @righteous architecture_processes_reader_chosen_outside_reader_layers
    return sorted(readers, key=lambda reader: (not reader.is_default, -reader.id))
