from core.modules.plan_reviews.declarations.plan_reviews_dependencies import PLAN_REVIEWS_DEPENDENCIES
from core.modules.plan_reviews.declarations.plan_reviews_former_event_keys import PLAN_REVIEWS_FORMER_EVENT_KEYS
from core.modules.plan_reviews.declarations.plan_reviews_buttons import PLAN_REVIEWS_BUTTONS
from core.modules.plan_reviews.windows.plan_reviews_windows import PLAN_REVIEWS_WINDOWS
from core.modules.plan_reviews.models.declarations.checkpoint_review_model_declaration import CheckpointReviewModelDeclaration
from core.modules.plan_reviews.skills.declarations.plan_reviews_skills import PLAN_REVIEWS_SKILLS
from engine.module.module import Module
from core.modules.plan_reviews.commands.plan_review_tip.plan_review_tip_subcommand import PlanReviewTipSubcommand
from core.modules.plan_reviews.commands.plan_rounds.plan_rounds_subcommand import PlanRoundsSubcommand
from core.modules.plan_reviews.listeners.critique_report_listener import CritiqueReportListener
from core.modules.plan_reviews.support.review_state import REVIEW_STATE
from core.modules.plan_reviews.commands.start_checkpoint_review.start_checkpoint_review_handler import StartCheckpointReviewHandler
from core.modules.plan_reviews.listeners.checkpoint_review_report_listener import CheckpointReviewReportListener
from core.modules.plan_reviews.listeners.checkpoint_review_start_listener import CheckpointReviewStartListener
from core.modules.plan_reviews.migrations.m001_review_setting_keys import ReviewSettingKeysMigration
from core.modules.plan_reviews.support.plan_review_settings import PLAN_REVIEW_SETTINGS


class PlanReviewsModule(Module):
    """Lets a user ask for a critique of a plan and shows its review rounds, added to the plan module from
    outside it, with the same means any module has."""

    name = "journal.core.plan_reviews"
    requires_engine = ">=7,<8"
    seed_reason = "its only state and rounds come from what a plan does"
    move_reason = "version 4 plan reviews were dropped when a journal moved"
    dependencies = PLAN_REVIEWS_DEPENDENCIES
    skills = PLAN_REVIEWS_SKILLS
    added_states = [REVIEW_STATE]
    listeners = [CritiqueReportListener, CheckpointReviewReportListener, CheckpointReviewStartListener]
    handlers = [StartCheckpointReviewHandler]
    models = [CheckpointReviewModelDeclaration]
    migrations = [ReviewSettingKeysMigration]
    settings = PLAN_REVIEW_SETTINGS
    former_event_keys = PLAN_REVIEWS_FORMER_EVENT_KEYS
    subcommands = [PlanRoundsSubcommand, PlanReviewTipSubcommand]
    buttons = PLAN_REVIEWS_BUTTONS
    windows = PLAN_REVIEWS_WINDOWS
