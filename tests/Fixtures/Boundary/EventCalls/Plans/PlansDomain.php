<?php

declare(strict_types=1);

namespace Tests\Fixtures\Boundary\EventCalls\Plans;

use App\Domains\Domain;
use Tests\Fixtures\Boundary\EventCalls\Tasks\TasksDomain;

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
}
