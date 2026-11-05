import errno


def client_disconnected(error: BaseException | None) -> bool:
    return isinstance(error, BrokenPipeError | ConnectionResetError) or (isinstance(error, OSError) and error.errno == errno.ENOTCONN)
