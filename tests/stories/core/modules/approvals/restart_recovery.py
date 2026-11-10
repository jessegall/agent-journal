from datetime import timedelta

import pytest

from engine.actor.actor import Actor
from core.base.command.bus import Bus
from core.base.query.queries import Queries
from core.testing.story import Story
from core.testing.story_fixture import StoryFixture
from core.modules.approvals.commands.answer_approval.answer_approval_handler import AnswerApprovalHandler
from core.modules.approvals.commands.move_approval.move_approval import MoveApproval
from core.modules.approvals.commands.recover_approvals.recover_approvals import RecoverApprovals
from core.modules.approvals.models.approval_request import ApprovalRequest
from core.modules.approvals.models.enums.approval_dock_type import ApprovalDockType
from core.modules.approvals.models.enums.approval_state import ApprovalState
from core.modules.approvals.models.lifecycles.approval_lifecycle import ApprovalLifecycle
from core.modules.docking.models.dock_item import DockItem
from core.modules.docking.models.enums.dock_item_state import DockItemState
from server.booting_work import BootingWork
from tests.stories.core.modules.approvals.standing_approvals import ResumeFixedSession, resume_approved
from tests.stories.core.modules.viewer.support.window_samples import NOTES
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.suites.coding.modules.workers.support.program_split import viewer_client
from tests.stories.support.story_checks import expect_value


class ApprovalAsked(StoryFixture):
    """An agent asked a person in the dock and nobody has answered."""

    parent = UserJoined

    def steps(self, story: Story) -> None:
        story.expect_refusal("phone pair --reason needed", "A person was asked in the dock", actor=story.agent)


class ApprovalRunning(StoryFixture):
    """A person accepted that request after the journal started, and its action is still running."""

    parent = ApprovalAsked

    def steps(self, story: Story) -> None:
        request = story.container.get(Queries).query(ApprovalRequest).first()
        with viewer_client(story):
            BootingWork().run(story.container)
            story.advance(timedelta(seconds=1))
            story.container.get(Bus).run(MoveApproval(request.id, ApprovalLifecycle.begin), story.user, environment_id=request.environment_id)


class CoveredRequestRunning(StoryFixture):
    """A standing yes covered a request, and the server stopped while its action ran, so it stays running."""

    parent = ResumeFixedSession

    def steps(self, story: Story) -> None:
        with viewer_client(story):
            BootingWork().run(story.container)
            story.advance(timedelta(seconds=1))
            with pytest.MonkeyPatch.context() as stopping:
                stopping.setattr(AnswerApprovalHandler, "run_action", stopped)
                with pytest.raises(SystemExit):
                    resume_approved(story)


class ServerRestarted(StoryFixture):
    """The journal started again while that action was running."""

    parent = ApprovalRunning

    def steps(self, story: Story) -> None:
        story.advance(timedelta(minutes=1))
        with viewer_client(story):
            BootingWork().run(story.container)


class CoveredRequestRestarted(StoryFixture):
    """The journal started again while the covered request's action was running."""

    parent = CoveredRequestRunning

    def steps(self, story: Story) -> None:
        story.advance(timedelta(minutes=1))
        with viewer_client(story):
            BootingWork().run(story.container)


def stopped(*arguments, **keywords):
    raise SystemExit(3)


def docked_requests(story) -> list[DockItem]:
    return list(story.container.get(Queries).query(DockItem).filter(type=ApprovalDockType.REQUEST.value, state=DockItemState.DOCKED).all_rows())


def test_a_claim_from_a_stopped_server_is_reopened_at_once(new_story):
    story = new_story(fixture=ServerRestarted)
    request = story.container.get(Queries).query(ApprovalRequest).first()
    expect_value(story.container.get(Bus).run(RecoverApprovals(), Actor.core()), 1)
    story.expect_rows(story.row(ApprovalRequest, request.id).state is ApprovalState.OPEN)


def test_accepting_a_request_left_running_by_a_restart_runs_it_without_the_running_error(new_story):
    story = new_story(fixture=ServerRestarted)
    request = story.container.get(Queries).query(ApprovalRequest).first()
    with viewer_client(story) as viewer:
        viewer.value("messages.chat", ["approval", "accept", str(request.id)])
    story.expect_rows(story.row(ApprovalRequest, request.id).state is ApprovalState.ACCEPTED)


def test_a_covered_request_cut_off_by_a_restart_is_accepted_again_with_no_card(new_story):
    story = new_story(NOTES, fixture=CoveredRequestRestarted)
    covered = list(story.container.get(Queries).query(ApprovalRequest).all_rows())[-1]
    expect_value((story.row(ApprovalRequest, covered.id).state, docked_requests(story)), (ApprovalState.RUNNING, []))
    expect_value(story.container.get(Bus).run(RecoverApprovals(), Actor.core()), 1)
    story.run_listeners()
    expect_value((story.row(ApprovalRequest, covered.id).state, docked_requests(story)), (ApprovalState.ACCEPTED, []))
