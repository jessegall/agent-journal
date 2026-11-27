<?php

declare(strict_types=1);

namespace Domain\Plans;

use App\Access\Contracts\PolicyProvider;
use App\Access\Values\PolicyDefinition;
use App\Agents\Drivers\Contracts\NativePartProvider;
use App\Agents\Enums\AccessType;
use App\Assignments\Contracts\AssignableContributor;
use App\Assignments\Contracts\AutoAssignmentProvider;
use App\Assignments\PoolDefinition;
use App\Bus\Contracts\Command;
use App\Bus\Contracts\CommandProvider;
use App\Concerns\HasAssignables;
use App\Concerns\HasLinkRecords;
use App\Concerns\HasStates;
use App\Declarations\Page;
use App\Declarations\PageActions;
use App\Declarations\PageSlots;
use App\Mcp\Contracts\McpToolProvider;
use App\Navigation\Contracts\DraftProducerProvider;
use App\Navigation\Contracts\NavigationProvider;
use App\Navigation\Contracts\PageProvider;
use App\Navigation\Contracts\SectionProvider;
use App\Navigation\Declarations\NavigationItem;
use App\Navigation\Enums\Icon;
use App\Profiles\Enums\SlotContextType;
use App\Records\Contracts\LinkRecordProvider;
use App\Records\Contracts\ShareRecordContributor;
use App\Records\Contracts\StateProvider;
use App\Records\Values\ShareRecordDefinition;
use App\Skills\Contracts\SkillProvider;
use App\Support\Domain;
use App\Support\Exports;
use App\Support\FolderClasses;
use App\Support\Searchable;
use App\Text\Declarations\Section;
use Domain\Plans\Commands\AssignPlanWork\AssignPlanWorkCommand;
use Domain\Plans\Commands\ReassignPlanWork\ReassignPlanWorkCommand;
use Domain\Plans\Commands\StartPlan\StartPlanCommand;
use Domain\Plans\Commands\UnassignPlanWork\UnassignPlanWorkCommand;
use Domain\Plans\Contracts\PlanDetailsResolver;
use Domain\Plans\Contracts\PlanResolver;
use Domain\Plans\Enums\PlanReviewStatus;
use Domain\Plans\Enums\PlanStatus;
use Domain\Plans\Enums\PlanType;
use Domain\Plans\Events\PlanCancelled;
use Domain\Plans\Events\PlanFinished;
use Domain\Plans\Events\PlanProgressChanged;
use Domain\Plans\Events\PlanReviewDecided;
use Domain\Plans\Events\PlanReviewRequested;
use Domain\Plans\Events\PlanReviewWithdrawn;
use Domain\Plans\Events\PlanStarted;
use Domain\Plans\Exceptions\PhaseMissing;
use Domain\Plans\Exceptions\PlanMissing;
use Domain\Plans\Exceptions\StartDenied;
use Domain\Plans\Http\Controllers\ApplyPlanGraphPageController;
use Domain\Plans\Http\Controllers\ApprovePlanReviewPageController;
use Domain\Plans\Http\Controllers\AssignPlanWorkPageController;
use Domain\Plans\Http\Controllers\CancelPlanPageController;
use Domain\Plans\Http\Controllers\CreatePlanPageController;
use Domain\Plans\Http\Controllers\FinishPlanPageController;
use Domain\Plans\Http\Controllers\ReassignPlanWorkPageController;
use Domain\Plans\Http\Controllers\RequestPlanChangesPageController;
use Domain\Plans\Http\Controllers\RequestPlanReviewPageController;
use Domain\Plans\Http\Controllers\StartPlanController;
use Domain\Plans\Http\Controllers\SuggestPlanGraphPageController;
use Domain\Plans\Http\Controllers\UndoPlanGraphPageController;
use Domain\Plans\Http\Controllers\WithdrawPlanReviewPageController;
use Domain\Plans\Http\Pages\Resolvers\PhaseWindowResolver;
use Domain\Plans\Http\Pages\Resolvers\PlansWindowResolver;
use Domain\Plans\Http\Pages\Resolvers\PlanTaskWindowResolver;
use Domain\Plans\Http\Pages\Resolvers\PlanWindowResolver;
use Domain\Plans\Http\Pages\Resolvers\TaskPlanSection;
use Domain\Plans\Http\Pages\Resolvers\WaitingPlansSection;
use Domain\Plans\Mcp\Resources\PlanResource;
use Domain\Plans\Models\Phase;
use Domain\Plans\Models\Plan;
use Domain\Plans\Policies\PlanPolicy;
use Domain\Plans\Support\Assignments\PlanTaskPoolFactory;
use Domain\Plans\Support\Mcp\HeldPlansOverview;
use Domain\Plans\Support\PhaseAssignmentProvider;
use Domain\Plans\Support\PhaseRecords;
use Domain\Plans\Support\PlanAssignmentProvider;
use Domain\Plans\Support\PlanDraftProducer;
use Domain\Plans\Support\PlanRecords;
use Domain\Plans\Support\PlanReferenceRecognizer;
use Domain\Plans\Support\PlanSearchAccess;
use Domain\Plans\Support\PlanSearchProvider;
use Domain\Plans\Support\PlanShareProvider;
use Domain\Plans\Support\Skills\PlanSkill;
use Domain\Plans\Support\States\ReviewPlanState;
use Domain\Plans\Support\States\WorkOnPlanState;
use Domain\Plans\Values\AssignedPlanFilters;
use Domain\Plans\Values\AssignedPlanList;
use Domain\Plans\Values\PhaseDetails;
use Domain\Plans\Values\PlanCard;
use Domain\Plans\Values\PlanDetails;
use Domain\Plans\Values\PlanFilters;
use Domain\Plans\Values\PlanList;
use Domain\Plans\Values\PlanPhaseTasks;
use Domain\Plans\Values\PlanProgress;
use Domain\Plans\Values\PlanSelection;
use Domain\Tasks\Support\TaskType;
use Domain\Tasks\TasksDomain;

final class PlansDomain extends Domain implements
    AssignableContributor,
    AutoAssignmentProvider,
    CommandProvider,
    DraftProducerProvider,
    LinkRecordProvider,
    McpToolProvider,
    NativePartProvider,
    NavigationProvider,
    PageProvider,
    PolicyProvider,
    SectionProvider,
    ShareRecordContributor,
    SkillProvider,
    StateProvider
{
    use HasAssignables;
    use HasLinkRecords;
    use HasStates;

    public function description(): string
    {
        return 'A goal with phases and the tasks in each phase.';
    }

    public function draftProducers(): array
    {
        return ['plan' => PlanDraftProducer::class];
    }

    /**
     * @return list<class-string<Domain>>
     */
    public function requires(): array
    {
        return [
            TasksDomain::class,
        ];
    }

    public function exports(): Exports
    {
        return Exports::make()
            ->events(
                PlanStarted::class,
                PlanFinished::class,
                PlanCancelled::class,
                PlanProgressChanged::class,
                PlanReviewRequested::class,
                PlanReviewWithdrawn::class,
                PlanReviewDecided::class,
            )
            ->contracts(
                PlanResolver::class,
                PlanDetailsResolver::class
            )
            ->values(
                PlanFilters::class,
                PlanList::class,
                PlanSelection::class,
                PlanCard::class,
                AssignedPlanFilters::class,
                AssignedPlanList::class,
                PlanProgress::class,
                PlanReviewStatus::class,
                PlanType::class,
                PlanStatus::class,
                PlanDetails::class,
                PlanPhaseTasks::class,
                PhaseDetails::class,
            )
            ->commands(
                StartPlanCommand::class,
                AssignPlanWorkCommand::class,
                ReassignPlanWorkCommand::class,
                UnassignPlanWorkCommand::class,
            )
            ->exceptions(PlanMissing::class, PhaseMissing::class, StartDenied::class)
            ->build();
    }

    public function assignables(): array
    {
        return [
            Plan::linkType() => PlanAssignmentProvider::class,
            Phase::linkType() => PhaseAssignmentProvider::class,
        ];
    }

    public function autoAssigners(): array
    {
        return [];
    }

    public function assignmentPools(): array
    {
        return [
            new PoolDefinition(
                PlanTaskPoolFactory::KEY,
                TaskType::linkType(),
                PlanTaskPoolFactory::class,
                'Tasks in a started plan',
            ),
        ];
    }

    /**
     * A plan may be shared as a summary root; it is never selected as a linked record of another share.
     */
    public function shareRecords(): array
    {
        return [new ShareRecordDefinition(Plan::linkType(), Plan::class, PlanShareProvider::class, [])];
    }

    public function linkRecords(): array
    {
        return [
            Plan::linkType() => PlanRecords::class,
            Phase::linkType() => PhaseRecords::class,
        ];
    }

    public function policies(): array
    {
        return [
            new PolicyDefinition(
                PlanPolicy::class,
                [AccessType::Read, AccessType::Create, AccessType::Edit, AccessType::Admin],
            ),
        ];
    }

    /**
     * @return list<class-string>
     */
    public function commands(): array
    {
        return FolderClasses::in(__DIR__.'/Commands/*', Command::class);
    }

    public function skills(): array
    {
        return [PlanSkill::class];
    }

    /**
     * The native part the plan layout mounts: the plan's reader with its outline, start and review.
     *
     * @return list<string>
     */
    public function nativeParts(): array
    {
        return ['PlanWindow.vue'];
    }

    public function pages(): array
    {
        return [
            Page::layout('list', 'Plans', Icon::Plan, PlansWindowResolver::class)
                ->at('')
                ->onHome(20)
                ->actions(fn (PageActions $actions) => $actions
                    ->post('{plan}/start', StartPlanController::class, 'start')
                    ->post('create', CreatePlanPageController::class, 'create-plan')),
            Page::layout('plan-task', 'Plan task', Icon::Plan, PlanTaskWindowResolver::class)
                ->at('{plan}/tasks/{task}'),
            Page::layout('plan', 'Plan', Icon::Plan, PlanWindowResolver::class)
                ->at('{plan}')
                ->inInspector()
                ->actions(fn (PageActions $actions) => $actions
                    ->post('{plan}/cancel', CancelPlanPageController::class, 'cancel-plan')
                    ->post('{plan}/graph/suggest', SuggestPlanGraphPageController::class, 'suggest-waits')
                    ->post('{plan}/graph/apply', ApplyPlanGraphPageController::class, 'apply-waits')
                    ->post('{plan}/graph/undo', UndoPlanGraphPageController::class, 'undo-waits')
                    ->post('{plan}/work', AssignPlanWorkPageController::class, 'assign-work')
                    ->post('{plan}/work/reassign', ReassignPlanWorkPageController::class, 'reassign-work')
                    ->post('{plan}/finish', FinishPlanPageController::class, 'finish-plan')
                    ->post('{plan}/review', RequestPlanReviewPageController::class, 'request-review')
                    ->post(
                        '{plan}/review/withdraw',
                        WithdrawPlanReviewPageController::class,
                        'withdraw-review',
                    )
                    ->post(
                        '{plan}/review/approve',
                        ApprovePlanReviewPageController::class,
                        'approve-review',
                    )
                    ->post(
                        '{plan}/review/changes',
                        RequestPlanChangesPageController::class,
                        'request-changes',
                    ))
                ->slots(fn (PageSlots $slots) => $slots->record('inspector', 'plan', 'plan')),
            Page::make('phase', 'Phase', Icon::Plan, PhaseWindowResolver::class, 'PhaseWindow.vue')
                ->at('{plan}/phases/{phase}'),
        ];
    }

    public function sections(): array
    {
        return [
            Section::layout(
                'waiting',
                'Waiting for review',
                'chat.dock',
                SlotContextType::Session,
                WaitingPlansSection::class,
            ),
            Section::make(
                'task-plan',
                'Plan',
                'tasks.inspector',
                SlotContextType::Record,
                TaskPlanSection::class,
                'TaskPlanSection.vue',
            ),
        ];
    }

    public function navigation(): array
    {
        return [
            NavigationItem::page('list', 'Plans', Icon::Plan, position: 20),
        ];
    }

    public function states(): array
    {
        return [
            WorkOnPlanState::class,
            ReviewPlanState::class,
        ];
    }

    public function mcpResources(): array
    {
        return [PlanResource::class];
    }

    public function overviewContributions(): array
    {
        return [HeldPlansOverview::class];
    }

    public function searchables(): array
    {
        return [
            Searchable::make(
                'plan',
                'Plans',
                PlanSearchAccess::class,
                PlanSearchProvider::class,
                PlanReferenceRecognizer::class,
            ),
        ];
    }
}
