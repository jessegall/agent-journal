<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Tasks;

use App\Domains\Domain;

final class TasksDomain implements Domain
{
    public function description(): string
    {
        return 'A fixture domain that requires nothing.';
    }

    public function requires(): array
    {
        return [];
    }
}
