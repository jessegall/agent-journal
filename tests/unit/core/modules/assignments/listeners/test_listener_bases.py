import pytest

from engine.enums.actor_count import ActorCount
from engine.model.assignable import Assignable
from engine.model.model import Model
from core.modules.assignments.assignments_module import AssignmentsModule
from core.modules.assignments.errors.listener_subject_error import ListenerSubjectError
from core.modules.assignments.listeners.assigned_listener import AssignedListener
from core.modules.assignments.listeners.unassigned_listener import UnassignedListener


class Parcel(Model, Assignable):
    model_name = "parcel"
    cli_name = "parcel"
    takes_actors = ActorCount.SINGLE


def test_a_base_listener_is_not_registered():
    assert AssignedListener not in AssignmentsModule.listeners and UnassignedListener not in AssignmentsModule.listeners


def test_a_subclass_registers_for_assignment_create_and_delete():
    class ParcelAssignedListener(AssignedListener):
        name = "depot.parcel-assigned"
        subject = Parcel

    class ParcelUnassignedListener(UnassignedListener):
        name = "depot.parcel-unassigned"
        subject = Parcel

    assert ParcelAssignedListener.event == "assignment.create" and ParcelUnassignedListener.event == "assignment.delete"


def test_a_subclass_that_names_no_subject_fails_when_it_is_declared():
    with pytest.raises(ListenerSubjectError, match="names no subject"):
        class NamelessListener(AssignedListener):
            name = "depot.nameless"
