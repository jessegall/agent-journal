from dataclasses import dataclass

from sync_server.device import Device


@dataclass(frozen=True)
class DeviceList:
    """Every device of the team, revoked ones too, for an admin."""

    devices: tuple[Device, ...]

    @classmethod
    def parsed(cls, devices: list) -> "DeviceList":
        return cls(tuple(Device(**device) for device in devices))
