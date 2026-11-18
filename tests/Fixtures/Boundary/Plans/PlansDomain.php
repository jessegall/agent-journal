<?php

declare(strict_types=1);

namespace Tests\Fixtures\Boundary\Plans;

use App\Domains\Contracts\Domain;
use Tests\Fixtures\Boundary\Tasks\TasksDomain;

final class PlansDomain implements Domain
{
    public function description(): string
    {
        return 'A fixture domain that requires Tasks.';
    }

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
