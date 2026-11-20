<?php

declare(strict_types=1);

namespace Domain\Plans;

use App\Actors\Contracts\ProvidesPolicies;
use App\Actors\Values\PolicyRegistration;
use App\Assignments\Contracts\ProvidesAutoAssignments;
use App\Assignments\Support\PoolDefinition;
use App\Autoload\Support\FolderClasses;
use App\Bus\Contracts\Command;
use App\Bus\Contracts\ProvidesCommands;
use App\Domains\Concerns\HasAssignables;
use App\Domains\Concerns\HasLinkRecords;
use App\Domains\Concerns\HasNumberedModels;
use App\Domains\Concerns\HasStates;
use App\Domains\Contracts\ProvidesAssignables;
use App\Domains\Contracts\ProvidesLinkRecords;
use App\Domains\Contracts\ProvidesStates;
use App\Domains\Support\Domain;
use App\Exports\Support\Exports;
use App\Mcp\Contracts\ProvidesMcpTools;
use App\Numbers\Contracts\ProvidesNumberedModels;
use App\Numbers\Support\NumberedModel;
use App\Sharing\Contracts\ProvidesShareRecords;
use App\Sharing\Support\ShareRecordRegistration;
use App\Skills\Contracts\ProvidesSkills;
use App\Ui\Contracts\ProvidesNavigation;
use App\Ui\Contracts\ProvidesPages;
use App\Ui\Contracts\ProvidesSections;
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
use Domain\Plans\Enums\PlanAbility;
use Domain\Plans\Enums\PlanState;
use Domain\Plans\Enums\PlanType;
use Domain\Plans\Enums\PlanView;
use Domain\Plans\Exceptions\PhaseMissing;
use Domain\Plans\Exceptions\PlanMissing;
use Domain\Plans\Exceptions\StartDenied;
use Domain\Plans\Http\Controllers\StartPlanController;
use Domain\Plans\Mcp\AssignedPlansTool;
use Domain\Plans\Mcp\AssignPlanWorkTool;
use Domain\Plans\Mcp\HeldPlansOverview;
use Domain\Plans\Mcp\PlansListTool;
use Domain\Plans\Mcp\ReassignPlanWorkTool;
use Domain\Plans\Mcp\UnassignPlanWorkTool;
use Domain\Plans\Models\Phase;
use Domain\Plans\Models\Plan;
use Domain\Plans\Policies\PlanPolicy;
use Domain\Plans\Resolvers\OpenPlansCount;
use Domain\Plans\Resolvers\PhaseWindowResolver;
use Domain\Plans\Resolvers\PlansWindowResolver;
use Domain\Plans\Resolvers\PlanWindowResolver;
use Domain\Plans\Resolvers\WaitingPlansCount;
use Domain\Plans\Resolvers\WaitingPlansSection;
use Domain\Plans\Skills\PlanSkill;
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
    ProvidesAssignables,
    ProvidesAutoAssignments,
    ProvidesCommands,
    ProvidesLinkRecords,
    ProvidesMcpTools,
    ProvidesNavigation,
    ProvidesNumberedModels,
    ProvidesPages,
    ProvidesPolicies,
    ProvidesSections,
    ProvidesShareRecords,
    ProvidesSkills,
    ProvidesStates
{
    use HasAssignables, HasLinkRecords, HasNumberedModels, HasStates;

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
            ->events(PlanStarted::class, PlanFinished::class, PlanCancelled::class, PlanProgressChanged::class)
            ->contracts(PlanResolver::class, PlanDetailsResolver::class)
            ->values(
                PlanFilters::class,
                PlanList::class,
                PlanSelection::class,
                PlanCard::class,
                AssignedPlanFilters::class,
                AssignedPlanList::class,
                PlanProgress::class,
                PlanType::class,
                PlanState::class,
                PlanDetails::class,
                PlanPhaseTasks::class,
                PhaseDetails::class,
                PlanView::class,
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
        return [new ShareRecordRegistration(Plan::LINK_TYPE, Plan::class, PlanShareProvider::class, [])];
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
        return [new PolicyRegistration(Plan::class, PlanPolicy::class, PlanAbility::class)];
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

    public function pages(): array
    {
        return [
            Page::make('list', 'Plans', Icon::Plan, PlansWindowResolver::class, 'PlansWindow.vue')
                ->at('')
                ->onHome(20)
                ->actions(ActionRoute::post('{plan}/start', StartPlanController::class, 'start')),
            Page::make('plan', 'Plan', Icon::Plan, PlanWindowResolver::class, 'PlanWindow.vue')
                ->at('{plan}')
                ->inInspector()
                ->slots(Slot::record('inspector', 'plan')),
            Page::make('phase', 'Phase', Icon::Plan, PhaseWindowResolver::class, 'PhaseWindow.vue')
                ->at('{plan}/phases/{phase}'),
        ];
    }

    public function sections(): array
    {
        return [
            Section::make(
                'waiting',
                'Waiting for review',
                'chat.dock',
                SlotContextType::Session,
                WaitingPlansSection::class,
                'WaitingPlansSection.vue',
            ),
        ];
    }

    public function navigation(): array
    {
        return [
            NavigationItem::page('list', 'Plans', Icon::Plan, position: 20)->children([
                NavigationItem::page('open', 'Open', page: 'list', query: ['state' => 'open'])
                    ->count(OpenPlansCount::class),
                NavigationItem::page('waiting', 'Waiting', page: 'list', query: ['state' => 'waiting'])
                    ->count(WaitingPlansCount::class),
                NavigationItem::page('closed', 'Closed', page: 'list', query: ['state' => 'closed']),
            ]),
        ];
    }

    public function numberedModels(): array
    {
        return [NumberedModel::global(Plan::class), NumberedModel::within(Phase::class, Plan::class)];
    }

    public function states(): array
    {
        return [WorkingOnPlanStateReference::TYPE_KEY => WorkingOnPlanStateFactory::class];
    }

    public function mcpTools(): array
    {
        return [
            AssignedPlansTool::class,
            PlansListTool::class,
            AssignPlanWorkTool::class,
            ReassignPlanWorkTool::class,
            UnassignPlanWorkTool::class,
        ];
    }

    public function mcpResources(): array
    {
        return [];
    }

    public function overviewContributions(): array
    {
        return [HeldPlansOverview::class];
    }
}
