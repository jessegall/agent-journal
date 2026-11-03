import errno


def client_left(error: BaseException | None) -> bool:
    return isinstance(error, BrokenPipeError | ConnectionResetError) or (isinstance(error, OSError) and error.errno == errno.ENOTCONN)
