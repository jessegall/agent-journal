<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Reports;

use App\Support\Domain;
use App\Support\Exports;
use Tests\Fixtures\Domains\Plans\PlansDomain;
use Tests\Fixtures\Domains\Tasks\TasksDomain;

final class ReportsDomain extends Domain
{
    public function description(): string
    {
        return 'A fixture domain that requires Tasks and Plans, which also requires Tasks.';
    }

    public function requires(): array
    {
        return [TasksDomain::class, PlansDomain::class];
    }

    public function exports(): Exports
    {
        return Exports::make()
            ->build();
    }
}
