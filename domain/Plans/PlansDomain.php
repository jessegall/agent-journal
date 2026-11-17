<?php

declare(strict_types=1);

namespace Domain\Plans;

use App\Domains\Domain;
use Domain\Tasks\TasksDomain;

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
}
