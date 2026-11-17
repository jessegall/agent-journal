<?php

declare(strict_types=1);

namespace App\Domain\Plans;

use App\Domain\Contracts\Domain;
use App\Domain\Contracts\ProvidesAssignables;
use App\Domain\Contracts\ProvidesNavigation;
use App\Domain\Contracts\ProvidesPages;
use App\Domain\Declarations\ActionRoute;
use App\Domain\Declarations\NavigationItem;
use App\Domain\Declarations\Page;
use App\Domain\Enums\Icon;
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
use App\Domain\Plans\Enums\PlanKind;
use App\Domain\Plans\Enums\PlanState;
use App\Domain\Plans\Exceptions\PlanMissing;
use App\Domain\Plans\Exceptions\StartDenied;
use App\Domain\Plans\Http\Controllers\StartPlanController;
use App\Domain\Plans\Models\Phase;
use App\Domain\Plans\Models\Plan;
use App\Domain\Plans\Readers\PlansWindowReader;
use App\Domain\Plans\Support\PhaseAssignmentProvider;
use App\Domain\Plans\Support\PlanAssignmentProvider;
use App\Domain\Tasks\TasksDomain;

final class PlansDomain implements Domain, ProvidesAssignables, ProvidesNavigation, ProvidesPages
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
            PlanKind::class,
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
        ];
    }

    public function navigation(): array
    {
        return [NavigationItem::page('list', 'Plans', Icon::Plan, position: 20)];
    }
}
