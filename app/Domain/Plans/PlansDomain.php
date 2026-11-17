<?php

declare(strict_types=1);

namespace App\Domain\Plans;

use App\Domain\Domain;
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
        return [];
    }
}
