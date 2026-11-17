<?php

declare(strict_types=1);

namespace App\Domain\Plans;

use App\Core\Ui\Contracts\ProvidesNavigation;
use App\Core\Ui\Contracts\ProvidesPages;
use App\Core\Ui\Contracts\ProvidesSections;
use App\Core\Ui\Declarations\ActionRoute;
use App\Core\Ui\Declarations\NavigationItem;
use App\Core\Ui\Declarations\Page;
use App\Core\Ui\Declarations\Section;
use App\Core\Ui\Declarations\Slot;
use App\Core\Ui\Enums\Icon;
use App\Core\Ui\Enums\SlotContextType;
use App\Domain\Contracts\Domain;
use App\Domain\Contracts\ProvidesAssignables;
use App\Domain\Plans\Api\AssignedPlanFilters;
use App\Domain\Plans\Api\AssignedPlanList;
use App\Domain\Plans\Api\Events\PlanProgressChanged;
use App\Domain\Plans\Api\Events\PlanStarted;
use App\Domain\Plans\Api\PlanCard;
use App\Domain\Plans\Api\PlanFilters;
use App\Domain\Plans\Api\PlanList;
use App\Domain\Plans\Api\PlanProgress;
use App\Domain\Plans\Api\PlanSelection;
use App\Domain\Plans\Contracts\PlanAssignments;
use App\Domain\Plans\Contracts\PlanReader;
use App\Domain\Plans\Contracts\PlanStarter;
use App\Domain\Plans\Enums\PlanState;
use App\Domain\Plans\Enums\PlanType;
use App\Domain\Plans\Exceptions\PlanMissing;
use App\Domain\Plans\Exceptions\StartDenied;
use App\Domain\Plans\Http\Controllers\StartPlanController;
use App\Domain\Plans\Models\Phase;
use App\Domain\Plans\Models\Plan;
use App\Domain\Plans\Readers\OpenPlansCount;
use App\Domain\Plans\Readers\PlansWindowReader;
use App\Domain\Plans\Readers\PlanWindowReader;
use App\Domain\Plans\Readers\WaitingPlansCount;
use App\Domain\Plans\Readers\WaitingPlansSection;
use App\Domain\Plans\Support\PhaseAssignmentProvider;
use App\Domain\Plans\Support\PlanAssignmentProvider;
use App\Domain\Tasks\TasksDomain;

final class PlansDomain implements Domain, ProvidesAssignables, ProvidesNavigation, ProvidesPages, ProvidesSections
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
            PlanAssignments::class,
            PlanStarter::class,
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
