<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Plans;

use App\Domain\Domain;
use Tests\Fixtures\Domains\Tasks\TasksDomain;

final class PlansDomain implements Domain
{
    public function description(): string
    {
        return 'A fixture domain that requires Tasks.';
    }

    public function requires(): array
    {
        return [TasksDomain::class];
    }
}
