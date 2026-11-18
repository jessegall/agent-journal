<?php

declare(strict_types=1);

namespace Domain\Plans;

use App\Bus\Contracts\ProvidesCommands;
use App\Domains\Contracts\Domain;
use App\Domains\Contracts\ProvidesAssignables;
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
use Domain\Plans\Api\Events\PlanProgressChanged;
use Domain\Plans\Api\Events\PlanStarted;
use Domain\Plans\Api\PlanCard;
use Domain\Plans\Api\PlanFilters;
use Domain\Plans\Api\PlanList;
use Domain\Plans\Api\PlanProgress;
use Domain\Plans\Api\PlanSelection;
use Domain\Plans\Commands\AddPhaseTasks;
use Domain\Plans\Commands\AssignPlanWork;
use Domain\Plans\Commands\ReassignPlanWork;
use Domain\Plans\Commands\StartPlan;
use Domain\Plans\Commands\UnassignPlanWork;
use Domain\Plans\Contracts\PlanReader;
use Domain\Plans\Enums\PlanState;
use Domain\Plans\Enums\PlanType;
use Domain\Plans\Exceptions\PlanMissing;
use Domain\Plans\Exceptions\StartDenied;
use Domain\Plans\Http\Controllers\StartPlanController;
use Domain\Plans\Models\Phase;
use Domain\Plans\Models\Plan;
use Domain\Plans\Readers\OpenPlansCount;
use Domain\Plans\Readers\PlansWindowReader;
use Domain\Plans\Readers\PlanWindowReader;
use Domain\Plans\Readers\WaitingPlansCount;
use Domain\Plans\Readers\WaitingPlansSection;
use Domain\Plans\Support\PhaseAssignmentProvider;
use Domain\Plans\Support\PlanAssignmentProvider;
use Domain\Tasks\TasksDomain;

final class PlansDomain implements Domain, ProvidesAssignables, ProvidesCommands, ProvidesNavigation, ProvidesPages, ProvidesSections
{
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

    /**
     * @return list<class-string>
     */
    public function exports(): array
    {
        return [
            PlanStarted::class,
            PlanProgressChanged::class,
            PlanReader::class,
            StartPlan::class,
            AssignPlanWork::class,
            ReassignPlanWork::class,
            UnassignPlanWork::class,
            PlanMissing::class,
            StartDenied::class,
            PlanFilters::class,
            PlanList::class,
            PlanSelection::class,
            PlanCard::class,
            AssignedPlanFilters::class,
            AssignedPlanList::class,
            PlanProgress::class,
            PlanType::class,
            PlanState::class,
        ];
    }

    public function assignables(): array
    {
        return [
            Plan::LINK_TYPE => PlanAssignmentProvider::class,
            Phase::LINK_TYPE => PhaseAssignmentProvider::class,
        ];
    }

    /**
     * @return list<class-string>
     */
    public function commands(): array
    {
        return [StartPlan::class, AddPhaseTasks::class, AssignPlanWork::class, ReassignPlanWork::class, UnassignPlanWork::class];
    }

    public function pages(): array
    {
        return [
            Page::make('list', 'Plans', Icon::Plan, PlansWindowReader::class, 'PlansWindow.vue')
                ->at('')
                ->onHome(20)
                ->actions(ActionRoute::post('{plan}/start', StartPlanController::class, 'start')),
            Page::make('plan', 'Plan', Icon::Plan, PlanWindowReader::class, 'PlanWindow.vue')
                ->at('{plan}')
                ->inInspector()
                ->slots(Slot::record('inspector', 'plan')),
        ];
    }

    public function sections(): array
    {
        return [
            Section::make('waiting', 'Waiting for review', 'chat.dock', SlotContextType::Session, WaitingPlansSection::class, 'WaitingPlansSection.vue'),
        ];
    }

    public function navigation(): array
    {
        return [
            NavigationItem::page('list', 'Plans', Icon::Plan, position: 20)->children([
                NavigationItem::page('open', 'Open', page: 'list', query: ['state' => 'open'])->count(OpenPlansCount::class),
                NavigationItem::page('waiting', 'Waiting', page: 'list', query: ['state' => 'waiting'])->count(WaitingPlansCount::class),
                NavigationItem::page('closed', 'Closed', page: 'list', query: ['state' => 'closed']),
            ]),
        ];
    }
}
