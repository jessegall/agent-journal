<?php

declare(strict_types=1);

namespace Tests\Fixtures\Boundary\Events\Plans;

use App\Domains\Support\Domain;
use App\Exports\Support\Exports;
use Tests\Fixtures\Boundary\Events\Tasks\TasksDomain;

final class PlansDomain extends Domain
{
    public function description(): string
    {
        return 'A fixture domain that hears Tasks events.';
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
