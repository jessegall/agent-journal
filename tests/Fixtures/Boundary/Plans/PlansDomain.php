<?php

declare(strict_types=1);

namespace Tests\Fixtures\Boundary\Plans;

use App\Exports\Support\Exports;
use App\Domains\Support\Domain;
use Tests\Fixtures\Boundary\Tasks\TasksDomain;

final class PlansDomain extends Domain
{
    public function description(): string
    {
        return 'A fixture domain that requires Tasks.';
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
