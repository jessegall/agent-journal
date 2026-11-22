<?php

declare(strict_types=1);

namespace Domain\Plans;

use App\Actors\Contracts\PolicyProvider;
use App\Actors\Values\PolicyDefinition;
use App\Assignments\Contracts\AutoAssignmentProvider;
use App\Assignments\Support\PoolDefinition;
use App\Autoload\Support\FolderClasses;
use App\Bus\Contracts\Command;
use App\Bus\Contracts\CommandProvider;
use App\Domains\Concerns\HasAssignables;
use App\Domains\Concerns\HasLinkRecords;
use App\Domains\Concerns\HasStates;
use App\Domains\Contracts\AssignableContributor;
use App\Domains\Contracts\LinkRecordProvider;
use App\Domains\Contracts\StateProvider;
use App\Domains\Support\Domain;
use App\Exports\Support\Exports;
use App\Mcp\Contracts\McpToolProvider;
use App\Operations\Enums\AccessType;
use App\Sharing\Contracts\ShareRecordContributor;
use App\Sharing\Support\ShareRecordDefinition;
use App\Skills\Contracts\SkillProvider;
use App\Ui\Contracts\NativePartProvider;
use App\Ui\Contracts\NavigationProvider;
use App\Ui\Contracts\PageProvider;
use App\Ui\Contracts\SectionProvider;
use App\Ui\Declarations\ActionRoute;
use App\Ui\Declarations\NavigationItem;
use App\Ui\Declarations\Page;
use App\Ui\Declarations\Section;
use App\Ui\Declarations\Slot;
use App\Ui\Enums\Icon;
use App\Ui\Enums\SlotContextType;
use Domain\Plans\Api\AssignedPlanFilters;
use Domain\Plans\Api\AssignedPlanList;
use Domain\Plans\Api\Events\PlanCancelled;
use Domain\Plans\Api\Events\PlanFinished;
use Domain\Plans\Api\Events\PlanProgressChanged;
use Domain\Plans\Api\Events\PlanReviewDecided;
use Domain\Plans\Api\Events\PlanReviewRequested;
use Domain\Plans\Api\Events\PlanReviewWithdrawn;
use Domain\Plans\Api\Events\PlanStarted;
use Domain\Plans\Api\PhaseDetails;
use Domain\Plans\Api\PlanCard;
use Domain\Plans\Api\PlanDetails;
use Domain\Plans\Api\PlanFilters;
use Domain\Plans\Api\PlanList;
use Domain\Plans\Api\PlanPhaseTasks;
use Domain\Plans\Api\PlanProgress;
use Domain\Plans\Api\PlanSelection;
use Domain\Plans\Assignments\PlanTaskPoolFactory;
use Domain\Plans\Commands\AssignPlanWork;
use Domain\Plans\Commands\ReassignPlanWork;
use Domain\Plans\Commands\StartPlan;
use Domain\Plans\Commands\UnassignPlanWork;
use Domain\Plans\Contracts\PlanDetailsResolver;
use Domain\Plans\Contracts\PlanResolver;
use Domain\Plans\Enums\PlanReviewState;
use Domain\Plans\Enums\PlanState;
use Domain\Plans\Enums\PlanType;
use Domain\Plans\Exceptions\PhaseMissing;
use Domain\Plans\Exceptions\PlanMissing;
use Domain\Plans\Exceptions\StartDenied;
use Domain\Plans\Http\Controllers\ApprovePlanReviewPageController;
use Domain\Plans\Http\Controllers\AssignPlanWorkPageController;
use Domain\Plans\Http\Controllers\CancelPlanPageController;
use Domain\Plans\Http\Controllers\CreatePlanPageController;
use Domain\Plans\Http\Controllers\FinishPlanPageController;
use Domain\Plans\Http\Controllers\ReassignPlanWorkPageController;
use Domain\Plans\Http\Controllers\RequestPlanChangesPageController;
use Domain\Plans\Http\Controllers\RequestPlanReviewPageController;
use Domain\Plans\Http\Controllers\StartPlanController;
use Domain\Plans\Http\Controllers\WithdrawPlanReviewPageController;
use Domain\Plans\Mcp\HeldPlansOverview;
use Domain\Plans\Mcp\PlanResource;
use Domain\Plans\Mcp\PlanSearch;
use Domain\Plans\Models\Phase;
use Domain\Plans\Models\Plan;
use Domain\Plans\Policies\PlanPolicy;
use Domain\Plans\Resolvers\OpenPlansCount;
use Domain\Plans\Resolvers\PhaseWindowResolver;
use Domain\Plans\Resolvers\PlansWindowResolver;
use Domain\Plans\Resolvers\PlanTaskWindowResolver;
use Domain\Plans\Resolvers\PlanWindowResolver;
use Domain\Plans\Resolvers\TaskPlanSection;
use Domain\Plans\Resolvers\WaitingPlansCount;
use Domain\Plans\Resolvers\WaitingPlansSection;
use Domain\Plans\Skills\PlanSkill;
use Domain\Plans\States\Support\ReviewingPlanStateFactory;
use Domain\Plans\States\Support\ReviewingPlanStateReference;
use Domain\Plans\States\Support\WorkingOnPlanStateFactory;
use Domain\Plans\States\Support\WorkingOnPlanStateReference;
use Domain\Plans\Support\PhaseAssignmentProvider;
use Domain\Plans\Support\PhaseRecords;
use Domain\Plans\Support\PlanAssignmentProvider;
use Domain\Plans\Support\PlanRecords;
use Domain\Plans\Support\PlanShareProvider;
use Domain\Tasks\Api\TaskType;
use Domain\Tasks\TasksDomain;

final class PlansDomain extends Domain implements
    AssignableContributor,
    AutoAssignmentProvider,
    CommandProvider,
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

    /**
     * @return list<class-string<Domain>>
     */
    public function requires(): array
    {
        return [TasksDomain::class];
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
            ->contracts(PlanResolver::class, PlanDetailsResolver::class)
            ->values(
                PlanFilters::class,
                PlanList::class,
                PlanSelection::class,
                PlanCard::class,
                AssignedPlanFilters::class,
                AssignedPlanList::class,
                PlanProgress::class,
                PlanReviewState::class,
                PlanType::class,
                PlanState::class,
                PlanDetails::class,
                PlanPhaseTasks::class,
                PhaseDetails::class,
            )
            ->commands(
                StartPlan::class,
                AssignPlanWork::class,
                ReassignPlanWork::class,
                UnassignPlanWork::class,
            )
            ->exceptions(PlanMissing::class, PhaseMissing::class, StartDenied::class)
            ->build();
    }

    public function assignables(): array
    {
        return [
            Plan::LINK_TYPE => PlanAssignmentProvider::class,
            Phase::LINK_TYPE => PhaseAssignmentProvider::class,
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
                TaskType::VALUE,
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
        return [new ShareRecordDefinition(Plan::LINK_TYPE, Plan::class, PlanShareProvider::class, [])];
    }

    public function linkRecords(): array
    {
        return [
            Plan::LINK_TYPE => PlanRecords::class,
            Phase::LINK_TYPE => PhaseRecords::class,
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
        return FolderClasses::in(__DIR__.'/Commands', Command::class);
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
                ->actions(
                    ActionRoute::post('{plan}/start', StartPlanController::class, 'start'),
                    ActionRoute::post('create', CreatePlanPageController::class, 'create-plan'),
                ),
            Page::layout('plan-task', 'Plan task', Icon::Plan, PlanTaskWindowResolver::class)
                ->at('{plan}/tasks/{task}'),
            Page::layout('plan', 'Plan', Icon::Plan, PlanWindowResolver::class)
                ->at('{plan}')
                ->inInspector()
                ->actions(
                    ActionRoute::post('{plan}/cancel', CancelPlanPageController::class, 'cancel-plan'),
                    ActionRoute::post('{plan}/work', AssignPlanWorkPageController::class, 'assign-work'),
                    ActionRoute::post('{plan}/work/reassign', ReassignPlanWorkPageController::class, 'reassign-work'),
                    ActionRoute::post('{plan}/finish', FinishPlanPageController::class, 'finish-plan'),
                    ActionRoute::post('{plan}/review', RequestPlanReviewPageController::class, 'request-review'),
                    ActionRoute::post(
                        '{plan}/review/withdraw',
                        WithdrawPlanReviewPageController::class,
                        'withdraw-review',
                    ),
                    ActionRoute::post(
                        '{plan}/review/approve',
                        ApprovePlanReviewPageController::class,
                        'approve-review',
                    ),
                    ActionRoute::post(
                        '{plan}/review/changes',
                        RequestPlanChangesPageController::class,
                        'request-changes',
                    ),
                )
                ->slots(Slot::record('inspector', 'plan', 'plan')),
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
            NavigationItem::page('list', 'Plans', Icon::Plan, group: 'web.work', position: 20)->children([
                NavigationItem::page('open', 'Open', page: 'list', query: ['state' => 'open'], position: 10)
                    ->count(OpenPlansCount::class),
                NavigationItem::page('waiting', 'Waiting', page: 'list', query: ['state' => 'waiting'], position: 20)
                    ->count(WaitingPlansCount::class),
                NavigationItem::page('closed', 'Closed', page: 'list', query: ['state' => 'closed'], position: 30),
            ]),
        ];
    }

    public function states(): array
    {
        return [
            WorkingOnPlanStateReference::TYPE_KEY => WorkingOnPlanStateFactory::class,
            ReviewingPlanStateReference::TYPE_KEY => ReviewingPlanStateFactory::class,
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

    public function searchContributions(): array
    {
        return [PlanSearch::class];
    }
}
