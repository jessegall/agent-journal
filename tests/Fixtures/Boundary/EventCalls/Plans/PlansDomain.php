<?php

declare(strict_types=1);

namespace Tests\Fixtures\Boundary\EventCalls\Plans;

use App\Domains\Support\Domain;
use App\Exports\Support\Exports;
use Tests\Fixtures\Boundary\EventCalls\Tasks\TasksDomain;

final class PlansDomain extends Domain
{
    public function description(): string
    {
        return 'A fixture domain that listens to Tasks events.';
    }

    public function requires(): array
    {
        return [TasksDomain::class];
    }

    public function exports(): Exports
    {
        return Exports::make()
            ->build();
    }
}
