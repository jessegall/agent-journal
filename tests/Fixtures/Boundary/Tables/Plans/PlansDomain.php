<?php

declare(strict_types=1);

namespace Tests\Fixtures\Boundary\Tables\Plans;

use App\Domains\Domain;
use Tests\Fixtures\Boundary\Tables\Tasks\TasksDomain;

final class PlansDomain implements Domain
{
    public function description(): string
    {
        return 'A fixture domain for the table rules that requires Tasks.';
    }

    public function requires(): array
    {
        return [TasksDomain::class];
    }
}
