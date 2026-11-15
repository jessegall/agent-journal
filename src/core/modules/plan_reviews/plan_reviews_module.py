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
from core.modules.plan_reviews.buttons.plan_reviews_critique_button import PlanReviewsCritiqueButton
from core.modules.plan_reviews.buttons.plan_reviews_end_review_button import PlanReviewsEndReviewButton
from core.modules.plan_reviews.buttons.plan_reviews_cancel_button import PlanReviewsCancelButton


class PlanReviewsModule(Module):
    """Lets a user ask for a critique of a plan and shows its review rounds, added to the plan module from
    outside it, with the same means any module has."""

    name = "journal.core.plan_reviews"
    requires_engine = ">=5,<6"
    seed_reason = "its only state and rounds come from what a plan does"
    move_reason = "version 4 plan reviews were dropped when a journal moved"
    dependencies = ["journal.core.agents", "journal.core.documents", "journal.core.drivers", "journal.core.plans", "journal.core.skills", "journal.core.templates", "journal.core.viewer", "journal.core.actors"]
    skills = PLAN_REVIEWS_SKILLS
    added_states = tuple([REVIEW_STATE])
    listeners = [CritiqueReportListener, CheckpointReviewReportListener, CheckpointReviewStartListener]
    handlers = [StartCheckpointReviewHandler]
    models = [CheckpointReviewModelDeclaration]
    migrations = [ReviewSettingKeysMigration]
    settings = PLAN_REVIEW_SETTINGS
    former_event_keys = {f"core.plans.checkpoint_review.{action}": f"core.plan_reviews.checkpoint_review.{action}" for action in ("created", "updated", "deleted")}
    subcommands = [PlanRoundsSubcommand, PlanReviewTipSubcommand]
    buttons = [PlanReviewsCritiqueButton,
               PlanReviewsEndReviewButton,
               PlanReviewsCancelButton]
    windows = PLAN_REVIEWS_WINDOWS
