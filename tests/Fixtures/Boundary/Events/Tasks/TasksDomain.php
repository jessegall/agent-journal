<?php

declare(strict_types=1);

namespace Tests\Fixtures\Boundary\Events\Tasks;

use App\Domain\Domain;

final class TasksDomain implements Domain
{
    public function description(): string
    {
        return 'A fixture domain that raises TaskClosed.';
    }

    public function requires(): array
    {
        return [];
    }
}
