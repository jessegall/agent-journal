from functools import cached_property
from pathlib import Path

from features.base import Feature
from features.faults.details import FaultsDetails
from features.faults.developing import developing
from features.faults.reports import FaultReports

__all__ = ["developing"]


class Faults(Feature):
    details = FaultsDetails

    @classmethod
    def default_for(cls, root) -> bool:
        return developing(Path(root).parent) if root else cls.default

    @cached_property
    def reports(self) -> FaultReports:
        return FaultReports(self)
