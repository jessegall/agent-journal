<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Plans;

use App\Domains\Support\Domain;
use App\Exports\Support\Exports;
use Tests\Fixtures\Domains\Tasks\TasksDomain;

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
