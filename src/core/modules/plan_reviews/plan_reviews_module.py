from core.base.module.module import Module
from core.base.skill.skill_declaration import SkillDeclaration
from core.base.viewer.button_declaration import ButtonCondition, ButtonDeclaration, Choice, ChoiceField, TemplateField
from core.base.viewer.skeleton_part import SkeletonPart
from core.base.viewer.window_declaration import WindowDeclaration
from core.base.viewer.window_key import WindowKey
from core.base.viewer.key_loading import KeyLoading
from core.base.viewer.window_icon import WindowIcon
from core.base.viewer.window_loading import WindowLoading
from core.base.viewer.window_place import WindowPlace
from core.modules.plan_reviews.commands.plan_rounds.plan_rounds_subcommand import PlanRoundsSubcommand
from core.modules.plan_reviews.listeners.critique_report_listener import CritiqueReportListener
from core.modules.plan_reviews.support.review_state import REVIEW_STATE


class PlanReviewsModule(Module):
    """Lets a person ask for a critique of a plan and shows its review rounds, added to the plan module from
    outside it, with the same means any module has."""

    name = "journal.core.plan_reviews"
    requires_core = ">=5,<6"
    seed_reason = "its only state and rounds come from what a plan does"
    move_reason = "version 4 plan reviews were dropped when a journal moved"
    dependencies = ["journal.core.agents", "journal.core.documents", "journal.core.drivers", "journal.core.plans", "journal.core.skills", "journal.core.templates", "journal.core.viewer"]
    skills = [SkillDeclaration("journal-plan-review-applying", "Working a critique of a plan into the plan is a light job; read it before you work a report of reviews into a plan or end its review", keywords=("review", "critique"), commands=tuple(["plan reviewed"]))]
    added_states = tuple([REVIEW_STATE])
    listeners = [CritiqueReportListener]
    subcommands = [PlanRoundsSubcommand]
    buttons = [ButtonDeclaration("plan_reviews.critique", ("dock.plans.waiting", "row.plan"), "Ask for a critique",
                                 "template send {template} --on=plan:{row_id} --set=agents={agents} --set=size={size}", icon="review",
                                 condition=ButtonCondition("state", tuple(["ready"])), tip="Reviewers read it before you approve",
                                 fields=(ChoiceField("agents", "How many agents", tuple(Choice("one agent" if count == 1 else f"{count} agents", str(count)) for count in range(1, 6)), "2 agents"),
                                         ChoiceField("size", "How thorough", tuple(Choice(size, size) for size in ("a quick look", "a normal read", "a thorough review")), "a normal read"),
                                         TemplateField("template", "Template", "plan", "critique", "General critique"))),
               ButtonDeclaration("plan_reviews.end-review", ("dock.plans.waiting", "row.plan"), "End the review", "plan reviewed {row_id}", icon="tick",
                                 condition=ButtonCondition("state", tuple(["reviewing"])), tip="The plan is ready again")]
    windows = [WindowDeclaration("plan_reviews.rounds", "Review rounds", "rounds.js", WindowLoading.COMPONENT, place=WindowPlace.SECTION,
                                 slots=tuple(["inspector.plan"]), icon=WindowIcon.REVIEW,
                                 reads=["plan rounds"], keys=[WindowKey("rounds.*", "plan rounds {id}", loading=KeyLoading.REQUESTED)], events=["plan.*"],
                                 skeleton=tuple([SkeletonPart.line()]))]
