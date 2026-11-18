<?php

declare(strict_types=1);

namespace Tests\Fixtures\Boundary\EventCalls\Tasks;

use App\Domains\Support\Domain;
use App\Exports\Support\Exports;

final class TasksDomain extends Domain
{
    public function description(): string
    {
        return 'A fixture domain that raises TaskClosed.';
    }

    public function requires(): array
    {
        return [];
    }

    public function exports(): Exports
    {
        return Exports::make()
            ->build();
    }
}
