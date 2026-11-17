<?php

declare(strict_types=1);

namespace Tests\Fixtures\Boundary\Tables\Tasks;

use App\Domains\Domain;

final class TasksDomain implements Domain
{
    public function description(): string
    {
        return 'A fixture domain for the table rules.';
    }

    public function requires(): array
    {
        return [];
    }
}
