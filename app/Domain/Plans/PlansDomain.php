<?php

declare(strict_types=1);

namespace App\Domain\Plans;

use App\Domain\Contracts\Domain;
use App\Domain\Plans\Api\PlanCard;
use App\Domain\Plans\Api\PlanFilters;
use App\Domain\Plans\Api\PlanKind;
use App\Domain\Plans\Api\PlanList;
use App\Domain\Plans\Api\PlanProgress;
use App\Domain\Plans\Api\PlanSelection;
use App\Domain\Plans\Api\PlanState;
use App\Domain\Plans\Contracts\PlanReader;
use App\Domain\Tasks\TasksDomain;

final class PlansDomain implements Domain
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
            PlanReader::class,
            PlanFilters::class,
            PlanList::class,
            PlanSelection::class,
            PlanCard::class,
            PlanProgress::class,
            PlanKind::class,
            PlanState::class,
        ];
    }
}
