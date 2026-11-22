<?php

declare(strict_types=1);

namespace Tests\Fixtures\Boundary\Events\Plans;

use App\Support\Domain;
use App\Support\Exports;
use Tests\Fixtures\Boundary\Events\Tasks\TasksDomain;

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
