<?php

declare(strict_types=1);

namespace App\Plans;

use App\Domains\Domain;
use App\Tasks\TasksDomain;

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
