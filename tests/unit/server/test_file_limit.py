import resource

from server.server import FILE_LIMIT, raise_file_limit


def test_the_server_raises_its_open_file_limit_when_it_starts():
    soft, hard = resource.getrlimit(resource.RLIMIT_NOFILE)
    resource.setrlimit(resource.RLIMIT_NOFILE, (256, hard))
    try:
        raise_file_limit()
        assert resource.getrlimit(resource.RLIMIT_NOFILE)[0] == (FILE_LIMIT if hard == resource.RLIM_INFINITY else min(FILE_LIMIT, hard))
    finally:
        resource.setrlimit(resource.RLIMIT_NOFILE, (soft, hard))
