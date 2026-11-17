<?php

declare(strict_types=1);

namespace Tests\Fixtures\Boundary\Events\Plans;

use App\Domain\Contracts\Domain;
use Tests\Fixtures\Boundary\Events\Tasks\TasksDomain;

final class PlansDomain implements Domain
{
    public function description(): string
    {
        return 'A fixture domain that hears Tasks events.';
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
