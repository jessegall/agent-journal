from functools import cached_property
from pathlib import Path

from features.base import Feature
from features.dev_faults.details import FaultsDetails
from features.dev_faults.developing import developing
from features.dev_faults.reports import FaultReports

__all__ = ["developing"]


class Faults(Feature):
    details = FaultsDetails

    @classmethod
    def default_for(cls, root) -> bool:
        return developing(Path(root).parent) if root else cls.default

    @cached_property
    def reports(self) -> FaultReports:
        return FaultReports(self)
