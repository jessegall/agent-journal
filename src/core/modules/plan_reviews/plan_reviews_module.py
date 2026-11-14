from core.modules.plan_reviews.windows.plan_reviews_windows import PLAN_REVIEWS_WINDOWS
from core.modules.plan_reviews.models.declarations.checkpoint_review_model_declaration import CheckpointReviewModelDeclaration
from core.modules.plan_reviews.skills.declarations.plan_reviews_skills import PLAN_REVIEWS_SKILLS
from engine.module.module import Module
from core.modules.plans.support.plan_button_slots import WAITING_PLAN_SLOTS
from engine.viewer.button_declaration import ButtonCondition, ButtonDeclaration, Choice, ChoiceField, TemplateField, TextField
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
    buttons = [ButtonDeclaration("plan_reviews.critique", WAITING_PLAN_SLOTS, "Request critique",
                                 "template send {template} --on=plan:{row_id} --set=agents={agents} --set=size={size}", icon="review",
                                 condition=ButtonCondition("state", tuple(["ready"])), tip="Reviewers read it before you approve",
                                 fields=(ChoiceField("agents", "How many agents", tuple(Choice("one agent" if count == 1 else f"{count} agents", str(count)) for count in range(1, 6)), "2 agents"),
                                         ChoiceField("size", "How thorough", tuple(Choice(size, size) for size in ("a quick look", "a normal read", "a thorough review")), "a normal read"),
                                         TemplateField("template", "Template", "plan", "critique", "General critique"))),
               ButtonDeclaration("plan_reviews.end-review", tuple(["row.plan"]), "End review", "plan reviewed {row_id}", icon="tick",
                                 condition=ButtonCondition("state", tuple(["reviewing"])), tip="The plan is ready again"),
               ButtonDeclaration("plan_reviews.cancel", tuple(["row.plan"]), "Cancel the plan", "plan cancel {row_id} --reason={reason}", icon="stop", danger=True,
                                 condition=ButtonCondition("state", tuple(["reviewing"])), fields=tuple([TextField("reason", "Why is it cancelled?")]))]
    windows = PLAN_REVIEWS_WINDOWS
