<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Plans;

use App\Support\Domain;
use App\Support\Exports;
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
