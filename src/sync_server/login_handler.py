from sync_server.devices import Devices
from sync_server.login_answer import LoginAnswer
from sync_server.server_clock import ServerClock


class LoginHandler:
    """Trades a person's email and password for a device token, the address being the one the proxy in front forwards."""

    def __init__(self, devices: Devices, clock: ServerClock) -> None:
        self.devices, self.clock = devices, clock

    def answer(self, email: str, password: str, device_name: str, address: str) -> LoginAnswer:
        device, token = self.devices.login(email, password, device_name, address, self.clock.time())
        person = self.devices.person(token)
        return LoginAnswer(token, device.id, person.id, person.name)
