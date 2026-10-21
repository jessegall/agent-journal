from supervisor.service import Service


class Services:
    """The named processes a supervisor runs beside the agent, each kept running until it is stopped."""

    def __init__(self, *services: Service) -> None:
        self._table = {service.name: service for service in services}

    def service(self, name: str) -> Service:
        if name not in self._table:
            raise LookupError(f"no process is named {name!r}")
        return self._table[name]

    def runs(self, name: str) -> bool:
        return name in self._table and self._table[name].is_active()

    def add(self, service: Service) -> None:
        if self.runs(service.name):
            return
        self._table[service.name] = service
        service.start()

    def remove(self, name: str) -> None:
        self.service(name).stop()
        del self._table[name]

    def start_all(self) -> None:
        for service in self._table.values():
            service.start()

    def revive_stopped(self) -> None:
        for service in self._table.values():
            service.revive()

    def described(self) -> list[dict]:
        return [service.described() for service in self._table.values()]

    def stop_all(self) -> None:
        for service in self._table.values():
            service.stop()
