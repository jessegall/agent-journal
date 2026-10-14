from journal.config import Config
from journal.http.router import Router


class Server:
    def __init__(self, config: Config, router: Router) -> None: ...

    def serve(self) -> None: ...

    def stop(self) -> None: ...
