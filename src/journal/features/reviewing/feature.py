from journal.support.agent_role import AgentRole
from journal.support.card_family import CardFamily
from journal.support.card_type_entry import CardTypeEntry
from journal.support.card_type_catalogue import AGENT
from journal.support.card_type import CardType
from journal.support.card_colouring import CardColouring
from journal.features.feature import Feature
from journal.features.reviewing.commands.reviewer_command import ReviewerCommand
from journal.features.reviewing.jobs.review_backlog import ReviewBacklog
from journal.features.reviewing.listeners.reviewer_loss import ReviewerLoss
from journal.features.reviewing.reviewing_part import ReviewingPart
from journal.features.reviewing.support.reviewing_data import ReviewingData
from journal.features.reviewing.support.reviewing_data_reader import ReviewingDataReader
from journal.features.reviewing.commands.review_command import ReviewCommand
from journal.features.reviewing.listeners.reviewer_retirement import ReviewerRetirement
from journal.features.reviewing.listeners.reviewer_start import ReviewerStart
from journal.features.reviewing.listeners.review_report_steps import ReviewReportSteps
from journal.features.reviewing.listeners.reviewer_test_failed import ReviewerTestFailed
from journal.features.reviewing.listeners.reviewer_test_passed import ReviewerTestPassed
from journal.features.reviewing.reviewing_conduct import ReviewingConduct
from journal.features.reviewing.reviewing_nudges import ReviewingNudges
from journal.features.reviewing.reviewing_options import ReviewingOptions
from journal.features.reviewing.states.reviewing import Reviewing


class ReviewingFeature(Feature[ReviewingData]):
    """In orchestrator mode with the reviewer on, a worker's clock-out goes to a reviewer the journal sends itself rather than to the agent that sent the worker: the reviewer is an agent of its own, never a worker, resting on Reviewing from its first hook; it reads the brief and each proof, runs the tests, judges the changes and reports each point, and the agent decides, sending the work back or merging it."""

    name = ReviewingPart.name
    card_families = (CardFamily("reviews", "Reviews", "verifier", AGENT, CardColouring.OUTCOME),)
    card_types = (CardTypeEntry(CardType.REVIEWERS, "Reviews of a worker's work", "reviews"),)
    title = "Reviewing workers' work"
    fixed = True
    help = "In orchestrator mode with the reviewer on, each worker that clocks out joins a review queue, in order, and the next free reviewer takes it; a reviewer's report on each point comes to the agent, which sends the work back or merges it. journal reviewer add starts another reviewer."
    states = (Reviewing,)
    helper_listeners = {AgentRole.REVIEWER: (ReviewerTestFailed, ReviewerTestPassed)}
    options = (ReviewingOptions.REVIEWER,)
    commands = (ReviewerCommand,)
    jobs = (ReviewBacklog,)
    helper_commands = {AgentRole.REVIEWER: (ReviewCommand,)}
    data = (ReviewingDataReader,)
    listeners = (ReviewerStart, ReviewerRetirement, ReviewerLoss, ReviewerTestPassed, ReviewerTestFailed, ReviewReportSteps)
    conduct = (ReviewingConduct,)
    nudges = (ReviewingNudges.REVIEWER_WRITES, ReviewingNudges.REPORT_REQUEST, ReviewingNudges.REVIEW_UNDECIDED, ReviewingNudges.REVIEW_FAILED, ReviewingNudges.REVIEWS_WAITING)
